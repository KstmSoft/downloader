const express = require('express'),
    router = express.Router(),
    ytdl = require('ytdl-core'),
    {check,validationResult} = require('express-validator'),
    controller = require('../controller/Controller');

router
    .get('/', (req, res) => {
        res.render('form', {
            title: 'Downloader | By KstmSoft'
        });
    })
    .post('/', 
        [check('url').isLength({
            min: 1
        }).isURL().withMessage('invalid url'),
        check('format').isLength({
            min: 1
        }).withMessage('empty format')], async (req, res) => {
            const errors = validationResult(req);
            try {
                if (!errors.isEmpty()) throw errors.array();
                await ytdl.getInfo(req.body.url).catch((e) => {
                    throw new TypeError(e.message)
                });
                controller.downloadFromYouTube(res, req.body.url, req.body.format);
            } catch (err) {
                res.render('form', {
                    title: 'Downloader | By KstmSoft',
                    errors: err
                });
            }
        })
    .post('/download', 
        [check('url').isLength({
            min: 1
        }).isURL().withMessage('invalid url'), 
        check('format').isLength({
            min: 1
        }).withMessage('empty format')], async function (req, res) {
            const errors = validationResult(req);
            try{
                if (!errors.isEmpty()) throw errors.array();
                await ytdl.getInfo(req.body.url).catch((e) => {
                    throw new TypeError(e.message)
                });
                controller.downloadFromYouTube(res, req.body.url, req.body.format);
            }catch(err){
                res.status(400).send('Invalid Request');
            }
        });

module.exports = router;