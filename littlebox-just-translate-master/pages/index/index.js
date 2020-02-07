//index.js
//获取应用实例
const app = getApp()
const fs = wx.getFileSystemManager();

Page({
  data: {
    on_icon: 'https://justtranslate-1258669417.cos.ap-shanghai.myqcloud.com/assets/m_on.png',
    off_icon: 'https://justtranslate-1258669417.cos.ap-shanghai.myqcloud.com/assets/m_off.png',
    right_arrow_icon: 'https://justtranslate-1258669417.cos.ap-shanghai.myqcloud.com/assets/right_arrow.png',
    isRecording: 0,
    iconStyle: 'color: red;',
    iconBorderStyle: 'border-color: red',
    recorderManager: undefined,
    showAction: false,
    recordOptions: {
      sampleRate: 8000,
      encodeBitRate: 48000,
      format: 'mp3',
      duration: 10000,
      numberOfChannels: 1,
    },
    hasPending: false,
    canvasContext: undefined,
    src_langs: ['English (UK)', 'English (US)', 'Japanese', 'Chinese'],
    dst_langs: ['English (UK)', 'English (US)', 'Japanese', 'Chinese'],
    langsMap: {
      'English (UK)': 'en-GB',
      'English (US)': 'en-US',
      'Japanese': 'ja-JP',
      'Chinese': 'zh'
    },
    sessionId: '',
    dst_lang_index: 3, 
    src_lang_index: 0,
    scrollTop: 0,
    copyRight: `Copyright © 2019${new Date().getFullYear() === 2019 ? '' : ` - ${new Date().getFullYear()}`} Little Box Studio`,
    transltedTextArray: [],
    transltedText: "",
    sourceTextArray: [],
    sourceText: "",
    microphoneIconClassName: "iconfont icon-microphone-black-shape just-translate-header-icon"
  },
  changeSourceLang: function(e) {
    this.setData({
      src_lang_index: e.detail.value
    })
  },
  changeDestinationLang: function (e) {
    this.setData({
      dst_lang_index: e.detail.value
    })
  },
  onLoad: function () {
  },
  onReady: function () {
    const ctx = wx.createCanvasContext('recordProgress');
    const that = this;
    that.setData({
      canvasContext: ctx
    }, () => {
      that.data.canvasContext.setLineWidth(2);
      that.data.canvasContext.setStrokeStyle('red');
      that.data.canvasContext.setLineCap('round');
      that.data.canvasContext.beginPath();
      that.data.canvasContext.arc(23, 23, 20, -0.5 * Math.PI, 1.5 * Math.PI, false);
      that.data.canvasContext.stroke();
      that.data.canvasContext.draw();
    });
  },
  drawRed: function() {
    const that = this;
    let progressInterval = that.data.progressInterval;
    if (progressInterval) clearInterval(progressInterval);
    that.data.canvasContext.setLineWidth(2);
    that.data.canvasContext.setStrokeStyle('red');
    that.data.canvasContext.setLineCap('round');
    that.data.canvasContext.beginPath();
    that.data.canvasContext.arc(23, 23, 20, -0.5 * Math.PI, 1.5 * Math.PI, false);
    that.data.canvasContext.stroke();
    that.data.canvasContext.draw();
    const step = 1;
    const startAngle = -0.5 * Math.PI;
    const endAngle = 0;
    that.setData({
      progressInterval,
      step,
      startAngle,
      endAngle,
      currentLeftTime: 6 - parseInt(step / 10)
    });
  },
  drawGreen: function () {
    const that = this;
    let progressInterval = that.data.progressInterval;
    if (progressInterval) clearInterval(progressInterval);
    function drawArc(s, e) {
      that.data.canvasContext.setFillStyle('transparent');
      that.data.canvasContext.clearRect(0, 0, 46, 46);
      that.data.canvasContext.draw();
      const x = 23, y = 23, radius = 20;
      that.data.canvasContext.setLineWidth(2);
      that.data.canvasContext.setStrokeStyle('green');
      that.data.canvasContext.setLineCap('round');
      that.data.canvasContext.beginPath();
      that.data.canvasContext.arc(x, y, radius, s, e, false);
      that.data.canvasContext.stroke()
      that.data.canvasContext.draw()
    }
    let step = that.data.step || 1, startAngle = that.data.startAngle || -0.5 * Math.PI, endAngle = that.data.endAngle || 0;
    const animation_interval = 100, n = 60;
    const animation = function () {
      if (step <= n) {
        endAngle = step * 2 * Math.PI / n - 0.5 * Math.PI;
        drawArc(startAngle, endAngle);
        step++;
        that.setData({
          step,
          endAngle,
          startAngle,
          currentLeftTime: 6 - parseInt(step / 10)
        })
      } else {
        if (progressInterval) clearInterval(progressInterval);
        progressInterval = setInterval(animation, animation_interval);
        step = 1;
        startAngle = -0.5 * Math.PI;
        endAngle = 0;
        that.setData({
          progressInterval,
          step,
          startAngle,
          endAngle,
          currentLeftTime: 6 - parseInt(step / 10)
        });
      }
    };
    progressInterval = setInterval(animation, animation_interval);
    that.setData({
      progressInterval: progressInterval
    });
  },
  getColor: function(status) {
    if(status === 2) return 'green';
    if(status === 1) return 'orange';
    return 'red';
  },
  getIconClassName: function(status) {
    if (status === 2) return 'iconfont icon-microphone-black-shape just-translate-header-icon-blinker';
    return 'iconfont icon-microphone-black-shape just-translate-header-icon';
  },
  sendAudio: function(audio) {
    const that = this;
    const srcLang = that.data.langsMap[that.data.src_langs[that.data.src_lang_index]];
    const dstLang = that.data.langsMap[that.data.dst_langs[that.data.dst_lang_index]];
    const sessionId = that.data.sessionId;
    console.log(srcLang, dstLang, sessionId);
    that.setData({
      hasPending: true
    }, () => {
      wx.uploadFile({
        url: 'https://japi.little-box.com.cn/api/translate',
        filePath: audio,
        name: 'audio',
        formData: {
          src_lang: srcLang,
          dst_lang: dstLang,
          session: sessionId
        },
        success(res) {
          console.log(res)
          fs.saveFile({
            tempFilePath: audio,
            success: function (res) {
              console.log('success', res)
              fs.removeSavedFile({
                filePath: res.savedFilePath,
                success: function (res) {
                  console.log('success', res)
                },
                fail: function (e) {
                  console.log('error', e)
                }
              })
            },
            fail: function(e) {
              console.log('error', e)
            }
          })
          const result = JSON.parse(res.data).data;
          if (result) {
            const array = that.data.transltedTextArray;
            const source = result.src.trim();
            const target = result.dst.trim();
            if (source && target) {
              array.push('Source: ' + source);
              array.push('Translation: ' + target);
              that.setData({
                transltedTextArray: array,
                transltedText: array.join("\n"),
                hasPending: false,
                scrollTop: that.data.scrollTop + 100
              })
            } else {
              that.setData({
                hasPending: false
              })
            }
          } else {
            that.setData({
              hasPending: false
            })
          }
        },
        error(e) {
          wx.getSavedFileList({
            success(res) {
              console.log(res)
            }
          })
          that.setData({
            hasPending: false
          })
        }
      })
    })
  },
  checkCanRecord: function(e) {
    const that = this;
    let currentStatus = that.data.isRecording;
    if (currentStatus === 2) {
      that.setData({
        showAction: !that.data.showAction
      })
    } else {
      that.doRecord(e);
    }
  },
  getNewStatus: function() {
    const that = this;
    let currentStatus = that.data.isRecording;
    if(currentStatus === 0) {
      return {
        source: 0,
        dst: 2
      };
    } else if(currentStatus === 1) {
      return {
        source: 1,
        dst: 2
      };
    } else if(currentStatus === 2) {
      return {
        source: 2,
        dst: 2
      };
    }
  },
  pauseRecord: function(e) {
    this.doRecord(e, 1);
  },
  stopRecord: function (e) {
    this.doRecord(e, 0);
  },
  doRecord: function(e, status) {
    const that = this;
    const newStatus = that.getNewStatus();
    let currentStatus = status !== undefined ? status : newStatus.dst;
    const timestamp = new Date().valueOf();
    const random = Math.floor((Math.random() + 1) * 10000);
    const sessionId = `${timestamp}${random}`;
    that.setData({
      iconStyle: `color: ${that.getColor(currentStatus)}`,
      isRecording: currentStatus,
      sessionId,
      iconBorderStyle: `border-color: ${that.getColor(currentStatus)}`,
      transltedText: currentStatus === 0 ? '' : that.data.transltedText,
      transltedTextArray: currentStatus === 0 ? [] : that.data.transltedTextArray,
      microphoneIconClassName: that.getIconClassName(currentStatus),
      showAction: false
    })
    if (!that.data.recorderManager) {
      const rm = wx.getRecorderManager();
      rm.onStart(() => {
        console.log('recorder start')
      })
      rm.onPause(() => {
        console.log('recorder pause')
      })
      rm.onStop((res) => {
        console.log('recorder stop', res)
        const { tempFilePath } = res
        that.sendAudio(tempFilePath);
        if (that.data.isRecording === 2) {
          rm.start(that.data.recordOptions)
        }
      })
      that.setData({
        recorderManager: rm
      })
    }
    if(currentStatus === 2) {
      if (newStatus.source === 1) {
        that.data.recorderManager.resume();
      } else {
        that.data.recorderManager.start(that.data.recordOptions);
      }
    } else if(currentStatus === 0) {
      that.data.recorderManager.stop();
    } else if (currentStatus === 1) {
      that.data.recorderManager.pause();
    }
  }
})
