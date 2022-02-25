const ytdl = require('ytdl-core'),
    ffmpeg = require('fluent-ffmpeg'),
    chalk = require('chalk');

module.exports = {
    downloadFromYouTube: function (res, url, format) {
        const video = ytdl(url, {
            format: 'mp4'
        });
        video
            .on('info', (info) => {
                console.log('================================================');
                console.log(chalk.bold(`[${format}]: ${info.videoDetails.title}`));
            })
            .on('error', (err) => {
                console.log('')
                console.log(`${chalk.red.bold('[x Error on download ]:')} at ${new Date()}`);
                res.status(500).send('Error downloading video.');
            })
            .on('progress', (chunkLength, downloaded, total) => {
                const percent = Math.floor((downloaded / total) * 100);
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`[Downloading]: ${url} | ${chalk.yellow.bold(`[${percent}%]`)}`);
            }).on('end', () => {
                console.log('')
                console.log(`${chalk.yellow.bold('[✔ Downloaded ]:')} at ${new Date()}`);
            });

        switch(format){
            case 'mp4':
                res.setHeader('Content-disposition', `attachment; filename=downloader-${new Date().getTime()}.mp4`);
                res.setHeader('Content-type', 'video/mp4');
                video.pipe(res);
                break;
            case 'mp3':
                res.setHeader('Content-disposition', `attachment; filename=downloader-${new Date().getTime()}.mp3`);
                res.setHeader('Content-type', 'audio/mpeg');
                try {
                    const ffstream = ffmpeg(video).toFormat('mp3').pipe();
                    ffstream
                        .on('error', (err) => {
                            console.log(`${chalk.red.bold('[x Error ]:')} at ${new Date()}`);
                            res.status(500).send('Error converting video.');
                        })
                        .on('end', () => {
                            console.log(`${chalk.green.bold('[✔ Converted ]:')} at ${new Date()}`);
                        })
                        .pipe(res, {
                            end: true
                        });
                } catch (err) {
                    console.log(`${chalk.red.bold('[x Error ]:')} at ${new Date()}`);
                    res.status(500).send('Error converting video.');
                }
                break;
            default:
                res.setHeader('Content-type', 'application/octet-stream');
                video.pipe(res);
                break;
        }
    }
}