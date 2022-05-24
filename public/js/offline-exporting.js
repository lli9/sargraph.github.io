'use strict';
(function (a) {
    if ("object" === typeof module && module.exports) {
        /** @type {function(!Object): undefined} */
        a["default"] = a;
        /** @type {function(!Object): undefined} */
        module.exports = a;
    } else {
        if ("function" === typeof define && define.amd) {
            define("highcharts/modules/offline-exporting", ["highcharts", "highcharts/modules/exporting"], function (anchor) {
                a(anchor);
                /** @type {!Object} */
                a.Highcharts = anchor;
                return a;
            });
        } else {
            a("undefined" !== typeof Highcharts ? Highcharts : void 0);
        }
    }
})(function (p) {
    /**
     * @param {!Object} d
     * @param {string} i
     * @param {!Array} v
     * @param {!Function} f
     * @return {undefined}
     */
    function f(d, i, v, f) {
        if (!d.hasOwnProperty(i)) {
            d[i] = f.apply(null, v);
        }
    }
    p = p ? p._modules : {};
    f(p, "mixins/download-url.js", [p["parts/Globals.js"]], function (Highcharts) {
        var win = Highcharts.win;
        var nav = win.navigator;
        var doc = win.document;
        var domurl = win.URL || win.webkitURL || win;
        /** @type {boolean} */
        var g = /Edge\/\d+/.test(nav.userAgent);
        /**
         * @param {string} data
         * @return {?}
         */
        Highcharts.dataURLtoBlob = function (data) {
            if ((data = data.match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/)) && 3 < data.length && win.atob && win.ArrayBuffer && win.Uint8Array && win.Blob && domurl.createObjectURL) {
                var binStr = win.atob(data[3]);
                var binary = new win.ArrayBuffer(binStr.length);
                binary = new win.Uint8Array(binary);
                /** @type {number} */
                var i = 0;
                for (; i < binary.length; ++i) {
                    binary[i] = binStr.charCodeAt(i);
                }
                data = new win.Blob([binary], {
                    type: data[1]
                });
                return domurl.createObjectURL(data);
            }
        };
        /**
         * @param {string} url
         * @param {string} filename
         * @return {undefined}
         */
        Highcharts.downloadURL = function (url, filename) {
            var anchor = doc.createElement("a");
            if ("string" === typeof url || url instanceof String || !nav.msSaveOrOpenBlob) {
                if (g || 2E6 < url.length) {
                    if (url = Highcharts.dataURLtoBlob(url), !url) {
                        throw Error("Failed to convert to blob");
                    }
                }
                if ("undefined" !== typeof anchor.download) {
                    /** @type {string} */
                    anchor.href = url;
                    /** @type {string} */
                    anchor.download = filename;
                    doc.body.appendChild(anchor);
                    anchor.click();
                    doc.body.removeChild(anchor);
                } else {
                    try {
                        var obj = win.open(url, "chart");
                        if ("undefined" === typeof obj || null === obj) {
                            throw Error("Failed to open window");
                        }
                    } catch (A) {
                        /** @type {string} */
                        win.location.href = url;
                    }
                }
            } else {
                nav.msSaveOrOpenBlob(url, filename);
            }
        };
    });
    f(p, "modules/offline-exporting.src.js", [p["parts/Globals.js"], p["parts/Utilities.js"]], function (Highcharts, merge) {
        /**
         * @param {string} url
         * @param {!Function} callback
         * @return {undefined}
         */
        function getScript(url, callback) {
            var appendToElement = doc.getElementsByTagName("head")[0];
            var script = doc.createElement("script");
            /** @type {string} */
            script.type = "text/javascript";
            /** @type {string} */
            script.src = url;
            /** @type {!Function} */
            script.onload = callback;
            /**
             * @return {undefined}
             */
            script.onerror = function () {
                Highcharts.error("Error loading script " + url);
            };
            appendToElement.appendChild(script);
        }
        var extend = merge.extend;
        var addEvent = Highcharts.addEvent;
        merge = Highcharts.merge;
        var win = Highcharts.win;
        var nav = win.navigator;
        var doc = win.document;
        var domurl = win.URL || win.webkitURL || win;
        /** @type {boolean} */
        var animate = /Edge\/|Trident\/|MSIE /.test(nav.userAgent);
        /** @type {number} */
        var duration = animate ? 150 : 0;
        Highcharts.CanVGRenderer = {};
        /**
         * @param {string} svg
         * @return {?}
         */
        Highcharts.svgToDataUrl = function (svg) {
            /** @type {boolean} */
            var a = -1 < nav.userAgent.indexOf("WebKit") && 0 > nav.userAgent.indexOf("Chrome");
            try {
                if (!a && 0 > nav.userAgent.toLowerCase().indexOf("firefox")) {
                    return domurl.createObjectURL(new win.Blob([svg], {
                        type: "image/svg+xml;charset-utf-16"
                    }));
                }
            } catch (k) {
            }
            return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
        };
        /**
         * @param {string} imageURL
         * @param {string} imageType
         * @param {?} callbackArgs
         * @param {?} scale
         * @param {!Function} successCallback
         * @param {!Function} taintedCallback
         * @param {!Function} noCanvasSupportCallback
         * @param {!Function} failedLoadCallback
         * @param {!Function} finallyCallback
         * @return {undefined}
         */
        Highcharts.imageToDataUrl = function (imageURL, imageType, callbackArgs, scale, successCallback, taintedCallback, noCanvasSupportCallback, failedLoadCallback, finallyCallback) {
            var img = new win.Image;
            /**
             * @return {undefined}
             */
            var loadHandler = function () {
                setTimeout(function () {
                    var canvas = doc.createElement("canvas");
                    var context = canvas.getContext && canvas.getContext("2d");
                    try {
                        if (context) {
                            /** @type {number} */
                            canvas.height = img.height * scale;
                            /** @type {number} */
                            canvas.width = img.width * scale;
                            context.drawImage(img, 0, 0, canvas.width, canvas.height);
                            try {
                                var cachedCriteriaTypes = canvas.toDataURL(imageType);
                                successCallback(cachedCriteriaTypes, imageType, callbackArgs, scale);
                            } catch (B) {
                                taintedHandler(imageURL, imageType, callbackArgs, scale);
                            }
                        } else {
                            noCanvasSupportCallback(imageURL, imageType, callbackArgs, scale);
                        }
                    } finally {
                        if (finallyCallback) {
                            finallyCallback(imageURL, imageType, callbackArgs, scale);
                        }
                    }
                }, duration);
            };
            /**
             * @return {undefined}
             */
            var errorHandler = function () {
                failedLoadCallback(imageURL, imageType, callbackArgs, scale);
                if (finallyCallback) {
                    finallyCallback(imageURL, imageType, callbackArgs, scale);
                }
            };
            /**
             * @return {undefined}
             */
            var taintedHandler = function () {
                img = new win.Image;
                /** @type {!Function} */
                taintedHandler = taintedCallback;
                /** @type {string} */
                img.crossOrigin = "Anonymous";
                /** @type {function(): undefined} */
                img.onload = loadHandler;
                /** @type {function(): undefined} */
                img.onerror = errorHandler;
                /** @type {string} */
                img.src = imageURL;
            };
            /** @type {function(): undefined} */
            img.onload = loadHandler;
            /** @type {function(): undefined} */
            img.onerror = errorHandler;
            /** @type {string} */
            img.src = imageURL;
        };
        /**
         * @param {string} svg
         * @param {!Object} options
         * @param {!Function} failCallback
         * @param {?} successCallback
         * @return {undefined}
         */
        Highcharts.downloadSVGLocal = function (svg, options, failCallback, successCallback) {
            /**
             * @param {!Object} svgElement
             * @param {number} pdf
             * @return {?}
             */
            function svgToPdf(svgElement, pdf) {
                pdf = new win.jsPDF("l", "pt", [svgElement.width.baseVal.value + 2 * pdf, svgElement.height.baseVal.value + 2 * pdf]);
                [].forEach.call(svgElement.querySelectorAll('*[visibility="hidden"]'), function (gapiEl) {
                    gapiEl.parentNode.removeChild(gapiEl);
                });
                win.svg2pdf(svgElement, pdf, {
                    removeInvalid: true
                });
                return pdf.output("datauristring");
            }
            /**
             * @return {undefined}
             */
            function downloadPDF() {
                /** @type {string} */
                dummySVGContainer.innerHTML = svg;
                var url = dummySVGContainer.getElementsByTagName("text");
                var timer;
                [].forEach.call(url, function (span) {
                    ["font-family", "font-size"].forEach(function (style) {
                        /** @type {!Node} */
                        var elem = span;
                        for (; elem && elem !== dummySVGContainer;) {
                            if (elem.style[style]) {
                                span.style[style] = elem.style[style];
                                break;
                            }
                            elem = elem.parentNode;
                        }
                    });
                    span.style["font-family"] = span.style["font-family"] && span.style["font-family"].split(" ").splice(-1);
                    timer = span.getElementsByTagName("title");
                    [].forEach.call(timer, function (a) {
                        span.removeChild(a);
                    });
                });
                url = svgToPdf(dummySVGContainer.firstChild, 0);
                try {
                    Highcharts.downloadURL(url, filename);
                    if (successCallback) {
                        successCallback();
                    }
                } catch (errorBoxText) {
                    failCallback(errorBoxText);
                }
            }
            /** @type {boolean} */
            var q = true;
            var libURL = options.libURL || Highcharts.getOptions().exporting.libURL;
            var dummySVGContainer = doc.createElement("div");
            var imageType = options.type || "image/png";
            var filename = (options.filename || "chart") + "." + ("image/svg+xml" === imageType ? "svg" : imageType.split("/")[1]);
            var scale = options.scale || 1;
            libURL = "/" !== libURL.slice(-1) ? libURL + "/" : libURL;
            if ("image/svg+xml" === imageType) {
                try {
                    if ("undefined" !== typeof nav.msSaveOrOpenBlob) {
                        var blob = new MSBlobBuilder;
                        blob.append(svg);
                        var svgurl = blob.getBlob("image/svg+xml");
                    } else {
                        svgurl = Highcharts.svgToDataUrl(svg);
                    }
                    Highcharts.downloadURL(svgurl, filename);
                    if (successCallback) {
                        successCallback();
                    }
                } catch (errorBoxText) {
                    failCallback(errorBoxText);
                }
            } else {
                if ("application/pdf" === imageType) {
                    if (win.jsPDF && win.svg2pdf) {
                        downloadPDF();
                    } else {
                        /** @type {boolean} */
                        q = true;
                        getScript(libURL + "jspdf.js", function () {
                            getScript(libURL + "svg2pdf.js", function () {
                                downloadPDF();
                            });
                        });
                    }
                } else {
                    svgurl = Highcharts.svgToDataUrl(svg);
                    /**
                     * @return {undefined}
                     */
                    var finallyHandler = function () {
                        try {
                            domurl.revokeObjectURL(svgurl);
                        } catch (w) {
                        }
                    };
                    Highcharts.imageToDataUrl(svgurl, imageType, {}, scale, function (url) {
                        try {
                            Highcharts.downloadURL(url, filename);
                            if (successCallback) {
                                successCallback();
                            }
                        } catch (errorBoxText) {
                            failCallback(errorBoxText);
                        }
                    }, function () {
                        var canvas = doc.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        /** @type {number} */
                        var imageWidth = svg.match(/^<svg[^>]*width\s*=\s*"?(\d+)"?[^>]*>/)[1] * scale;
                        /** @type {number} */
                        var height = svg.match(/^<svg[^>]*height\s*=\s*"?(\d+)"?[^>]*>/)[1] * scale;
                        /**
                         * @return {undefined}
                         */
                        var downloadWithCanVG = function () {
                            ctx.drawSvg(svg, 0, 0, imageWidth, height);
                            try {
                                Highcharts.downloadURL(nav.msSaveOrOpenBlob ? canvas.msToBlob() : canvas.toDataURL(imageType), filename);
                                if (successCallback) {
                                    successCallback();
                                }
                            } catch (errorBoxText) {
                                failCallback(errorBoxText);
                            } finally {
                                finallyHandler();
                            }
                        };
                        /** @type {number} */
                        canvas.width = imageWidth;
                        /** @type {number} */
                        canvas.height = height;
                        if (win.canvg) {
                            downloadWithCanVG();
                        } else {
                            /** @type {boolean} */
                            q = true;
                            getScript(libURL + "rgbcolor.js", function () {
                                getScript(libURL + "canvg.js", function () {
                                    downloadWithCanVG();
                                });
                            });
                        }
                    }, failCallback, failCallback, function () {
                        if (q) {
                            finallyHandler();
                        }
                    });
                }
            }
        };
        /**
         * @param {!Object} options
         * @param {?} chartOptions
         * @param {!Function} failCallback
         * @param {!Function} successCallback
         * @return {undefined}
         */
        Highcharts.Chart.prototype.getSVGForLocalExport = function (options, chartOptions, failCallback, successCallback) {
            var chart = this;
            /** @type {number} */
            var valid_parts_count = 0;
            var chartCopyContainer;
            var chartCopyOptions;
            var l;
            var svgurl;
            /**
             * @return {undefined}
             */
            var sanitize = function () {
                if (valid_parts_count === parts.length) {
                    successCallback(chart.sanitizeSVG(chartCopyContainer.innerHTML, chartCopyOptions));
                }
            };
            /**
             * @param {?} imageURL
             * @param {?} imageType
             * @param {?} callbackArgs
             * @return {undefined}
             */
            var embeddedSuccess = function (imageURL, imageType, callbackArgs) {
                ++valid_parts_count;
                callbackArgs.imageElement.setAttributeNS("http://www.w3.org/1999/xlink", "href", imageURL);
                sanitize();
            };
            chart.unbindGetSVG = addEvent(chart, "getSVG", function (prefsEditor) {
                chartCopyOptions = prefsEditor.chartCopy.options;
                chartCopyContainer = prefsEditor.chartCopy.container.cloneNode(true);
            });
            chart.getSVGForExport(options, chartOptions);
            var parts = chartCopyContainer.getElementsByTagName("image");
            try {
                if (!parts.length) {
                    successCallback(chart.sanitizeSVG(chartCopyContainer.innerHTML, chartCopyOptions));
                    return;
                }
                /** @type {number} */
                var i = 0;
                l = parts.length;
                for (; i < l; ++i) {
                    var el = parts[i];
                    if (svgurl = el.getAttributeNS("http://www.w3.org/1999/xlink", "href")) {
                        Highcharts.imageToDataUrl(svgurl, "image/png", {
                            imageElement: el
                        }, options.scale, embeddedSuccess, failCallback, failCallback, failCallback);
                    } else {
                        ++valid_parts_count;
                        el.parentNode.removeChild(el);
                        sanitize();
                    }
                }
            } catch (errorBoxText) {
                failCallback(errorBoxText);
            }
            chart.unbindGetSVG();
        };
        /**
         * @param {!Function} init
         * @param {?} chartOptions
         * @return {undefined}
         */
        Highcharts.Chart.prototype.exportChartLocal = function (init, chartOptions) {
            var chart = this;
            var options = Highcharts.merge(chart.options.exporting, init);
            /**
             * @param {string} a
             * @return {undefined}
             */
            var fallbackToExportServer = function (a) {
                if (false === options.fallbackToExportServer) {
                    if (options.error) {
                        options.error(options, a);
                    } else {
                        Highcharts.error(28, true);
                    }
                } else {
                    chart.exportChart(options);
                }
            };
            /**
             * @return {?}
             */
            init = function () {
                return [].some.call(chart.container.getElementsByTagName("image"), function (href) {
                    href = href.getAttribute("href");
                    return "" !== href && 0 !== href.indexOf("data:");
                });
            };
            if (animate && chart.styledMode) {
                /** @type {!Array} */
                Highcharts.SVGRenderer.prototype.inlineWhitelist = [/^blockSize/, /^border/, /^caretColor/, /^color/, /^columnRule/, /^columnRuleColor/, /^cssFloat/, /^cursor/, /^fill$/, /^fillOpacity/, /^font/, /^inlineSize/, /^length/, /^lineHeight/, /^opacity/, /^outline/, /^parentRule/, /^rx$/, /^ry$/, /^stroke/, /^textAlign/, /^textAnchor/, /^textDecoration/, /^transform/, /^vectorEffect/, /^visibility/, /^x$/, /^y$/];
            }
            if (animate && ("application/pdf" === options.type || chart.container.getElementsByTagName("image").length && "image/svg+xml" !== options.type) || "application/pdf" === options.type && init()) {
                fallbackToExportServer("Image type not supported for this chart/browser.");
            } else {
                chart.getSVGForLocalExport(options, chartOptions, fallbackToExportServer, function (svg) {
                    if (-1 < svg.indexOf("<foreignObject") && "image/svg+xml" !== options.type) {
                        fallbackToExportServer("Image type not supportedfor charts with embedded HTML");
                    } else {
                        Highcharts.downloadSVGLocal(svg, extend({
                            filename: chart.getFilename()
                        }, options), fallbackToExportServer);
                    }
                });
            }
        };
        merge(true, Highcharts.getOptions().exporting, {
            libURL: "https://code.highcharts.com/8.0.0/lib/",
            menuItemDefinitions: {
                downloadPNG: {
                    textKey: "downloadPNG",
                    onclick: function () {
                        this.exportChartLocal();
                    }
                },
                downloadJPEG: {
                    textKey: "downloadJPEG",
                    onclick: function () {
                        this.exportChartLocal({
                            type: "image/jpeg"
                        });
                    }
                },
                downloadSVG: {
                    textKey: "downloadSVG",
                    onclick: function () {
                        this.exportChartLocal({
                            type: "image/svg+xml"
                        });
                    }
                },
                downloadPDF: {
                    textKey: "downloadPDF",
                    onclick: function () {
                        this.exportChartLocal({
                            type: "application/pdf"
                        });
                    }
                }
            }
        });
    });
    f(p, "masters/modules/offline-exporting.src.js", [], function () {
    });
});
