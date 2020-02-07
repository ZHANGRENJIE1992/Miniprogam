'use strict';

const Service = require('../../../custom_module/Basic/BasicService');
const toArray = require('stream-to-array');
const fs = require('fs');
const path = require('path');
const speech = require('@google-cloud/speech');
const Translate = require('@google-cloud/translate');
const sox = require('sox.js');
const langMap = {
    'en-GB': 'en',
    'en-US': 'en',
    zh: 'zh',
    'ja-JP': 'ja'
};

class TranslateService extends Service {
    async translate(params, stream, date = undefined) {
        try {
            if (!date) date = new Date().valueOf();
            const parts = await toArray(stream);
            const buffer = Buffer.concat(parts);
            await this.writeFile(buffer, params.session, date);
            await this.convertMp3ToFlac(params.session, date);
            const newBuffer = await this.readFile(params.session, date);
            const client = new speech.SpeechClient();
            const audioBytes = newBuffer.toString('base64');
            const audio = {
                content: audioBytes
            };
            const config = {
                encoding: 'FLAC',
                languageCode: params.src_lang,
                audioChannelCount: 2,
                enableSeparateRecognitionPerChannel: false
            };
            const request = {
                audio: audio,
                config: config
            };
            const [response] = await client.recognize(request);
            const transcription = response.results.map(result => result.alternatives[0].transcript).join('\n');
            const translate = new Translate.v2.Translate({ projectId: 'just-translate-261406' });
            const text = transcription;
            const target = langMap[params.dst_lang];
            const [translation] = await translate.translate(text, target);
            await this.deleteFile(params.session, date);
            console.log('translate', transcription, translation);
            return {
                src: transcription,
                dst: translation
            };
        } catch (e) {
            console.log(e);
            return await this.translate(params, stream, date);
        }
    }

    convertMp3ToFlac(session, date) {
        return new Promise((resolve, reject) => {
            sox(
                {
                    inputFile: path.join(__dirname, '../../public/' + session + date + '.mp3'),
                    input: {
                        volume: 3
                    },
                    outputFile: path.join(__dirname, '../../public/' + session + date + '.flac')
                },
                (err, res) => {
                    if (err) {
                        // reject(err);
                    } else {
                        // resolve(res);
                    }
                    resolve(res);
                }
            );
        });
    }

    deleteFile(session, date) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(path.join(__dirname, '../../public/' + session + date + '.mp3'))) {
                fs.unlink(path.join(__dirname, '../../public/' + session + date + '.mp3'), err => {
                    if (err) {
                        reject(err);
                    }
                });
            }
            if (fs.existsSync(path.join(__dirname, '../../public/' + session + date + '.flac'))) {
                fs.unlink(path.join(__dirname, '../../public/' + session + date + '.flac'), err => {
                    if (err) {
                        reject(err);
                    }
                });
            }
            resolve();
        });
    }

    writeFile(buffer, session, date) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path.join(__dirname, '../../public/' + session + date + '.mp3'), buffer, () => {
                resolve();
            });
        });
    }

    readFile(session, date) {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, '../../public/' + session + date + '.flac'), (e, res) => {
                resolve(res);
            });
        });
    }
}

module.exports = TranslateService;
