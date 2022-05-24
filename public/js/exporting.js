'use strict';
(function (exports) {
    if ("object" === typeof module && module.exports) {
        /** @type {function(!Object): undefined} */
        exports["default"] = exports;
        /** @type {function(!Object): undefined} */
        module.exports = exports;
    } else {
        if ("function" === typeof define && define.amd) {
            define("highcharts/modules/exporting", ["highcharts"], function (tree) {
                exports(tree);
                /** @type {!Object} */
                exports.Highcharts = tree;
                return exports;
            });
        } else {
            exports("undefined" !== typeof Highcharts ? Highcharts : void 0);
        }
    }
})(function (t) {
    /**
     * @param {!Object} a
     * @param {string} b
     * @param {!Array} r
     * @param {!Function} g
     * @return {undefined}
     */
    function k(a, b, r, g) {
        if (!a.hasOwnProperty(b)) {
            a[b] = g.apply(null, r);
        }
    }
    t = t ? t._modules : {};
    k(t, "modules/full-screen.src.js", [t["parts/Globals.js"]], function (V) {
        (V.FullScreen = function (context) {
            this.init(context.parentNode);
        }).prototype = {
            init: function (container) {
                var dummyPromise;
                if (container.requestFullscreen) {
                    dummyPromise = container.requestFullscreen();
                } else {
                    if (container.mozRequestFullScreen) {
                        dummyPromise = container.mozRequestFullScreen();
                    } else {
                        if (container.webkitRequestFullscreen) {
                            dummyPromise = container.webkitRequestFullscreen();
                        } else {
                            if (container.msRequestFullscreen) {
                                dummyPromise = container.msRequestFullscreen();
                            }
                        }
                    }
                }
                if (dummyPromise) {
                    dummyPromise["catch"](function () {
                        alert("Full screen is not supported inside a frame");
                    });
                }
            }
        };
    });
    k(t, "mixins/navigation.js", [], function () {
        return {
            initUpdate: function (self) {
                if (!self.navigation) {
                    self.navigation = {
                        updates: [],
                        update: function (a, lineNumber) {
                            this.updates.forEach(function (g) {
                                g.update.call(g.context, a, lineNumber);
                            });
                        }
                    };
                }
            },
            addUpdate: function (update, self) {
                if (!self.navigation) {
                    this.initUpdate(self);
                }
                self.navigation.updates.push({
                    update: update,
                    context: self
                });
            }
        };
    });
    k(t, "modules/exporting.src.js", [t["parts/Globals.js"], t["parts/Utilities.js"], t["mixins/navigation.js"]], function (H, defaultOptions, self) {
        var discardElement = defaultOptions.discardElement;
        var extend = defaultOptions.extend;
        var display = defaultOptions.isObject;
        var objectEach = defaultOptions.objectEach;
        var pick = defaultOptions.pick;
        defaultOptions = H.defaultOptions;
        var doc = H.doc;
        var Chart = H.Chart;
        var addEvent = H.addEvent;
        var removeEvent = H.removeEvent;
        var fireEvent = H.fireEvent;
        var createElement = H.createElement;
        var css = H.css;
        var merge = H.merge;
        var isTouchDevice = H.isTouchDevice;
        var win = H.win;
        var ua = win.navigator.userAgent;
        var SVGRenderer = H.SVGRenderer;
        var symbols = H.Renderer.prototype.symbols;
        /** @type {boolean} */
        var isDangkr = /Edge\/|Trident\/|MSIE /.test(ua);
        /** @type {boolean} */
        var isAOS = /firefox/i.test(ua);
        extend(defaultOptions.lang, {
            viewFullscreen: "View in full screen",
            printChart: "Print chart",
            downloadPNG: "Download PNG image",
            downloadJPEG: "Download JPEG image",
            downloadPDF: "Download PDF document",
            downloadSVG: "Download SVG vector image",
            contextButtonTitle: "Chart context menu"
        });
        if (!defaultOptions.navigation) {
            defaultOptions.navigation = {};
        }
        merge(true, defaultOptions.navigation, {
            buttonOptions: {
                theme: {},
                symbolSize: 14,
                symbolX: 12.5,
                symbolY: 10.5,
                align: "right",
                buttonSpacing: 3,
                height: 22,
                verticalAlign: "top",
                width: 24
            }
        });
        merge(true, defaultOptions.navigation, {
            menuStyle: {
                border: "1px solid #999999",
                background: "#ffffff",
                padding: "5px 0"
            },
            menuItemStyle: {
                padding: "0.5em 1em",
                color: "#333333",
                background: "none",
                fontSize: isTouchDevice ? "14px" : "11px",
                transition: "background 250ms, color 250ms"
            },
            menuItemHoverStyle: {
                background: "#335cad",
                color: "#ffffff"
            },
            buttonOptions: {
                symbolFill: "#666666",
                symbolStroke: "#666666",
                symbolStrokeWidth: 3,
                theme: {
                    padding: 5
                }
            }
        });
        defaultOptions.exporting = {
            type: "image/png",
            url: "https://export.highcharts.com/",
            printMaxWidth: 780,
            scale: 2,
            buttons: {
                contextButton: {
                    className: "highcharts-contextbutton",
                    menuClassName: "highcharts-contextmenu",
                    symbol: "menu",
                    titleKey: "contextButtonTitle",
                    menuItems: "viewFullscreen printChart separator downloadPNG downloadJPEG downloadPDF downloadSVG".split(" ")
                }
            },
            menuItemDefinitions: {
                viewFullscreen: {
                    textKey: "viewFullscreen",
                    onclick: function () {
                        this.fullscreen = new H.FullScreen(this.container);
                    }
                },
                printChart: {
                    textKey: "printChart",
                    onclick: function () {
                        this.print();
                    }
                },
                separator: {
                    separator: true
                },
                downloadPNG: {
                    textKey: "downloadPNG",
                    onclick: function () {
                        this.exportChart();
                    }
                },
                downloadJPEG: {
                    textKey: "downloadJPEG",
                    onclick: function () {
                        this.exportChart({
                            type: "image/jpeg"
                        });
                    }
                },
                downloadPDF: {
                    textKey: "downloadPDF",
                    onclick: function () {
                        this.exportChart({
                            type: "application/pdf"
                        });
                    }
                },
                downloadSVG: {
                    textKey: "downloadSVG",
                    onclick: function () {
                        this.exportChart({
                            type: "image/svg+xml"
                        });
                    }
                }
            }
        };
        /**
         * @param {string} url
         * @param {?} type
         * @param {?} props
         * @return {undefined}
         */
        H.post = function (url, type, props) {
            var form = createElement("form", merge({
                method: "post",
                action: url,
                enctype: "multipart/form-data"
            }, props), {
                display: "none"
            }, doc.body);
            objectEach(type, function (command_module_id, newPrinter) {
                createElement("input", {
                    type: "hidden",
                    name: newPrinter,
                    value: command_module_id
                }, null, form);
            });
            form.submit();
            discardElement(form);
        };
        if (H.isSafari) {
            H.win.matchMedia("print").addListener(function (a) {
                if (H.printingChart) {
                    if (a.matches) {
                        H.printingChart.beforePrint();
                    } else {
                        H.printingChart.afterPrint();
                    }
                }
            });
        }
        extend(Chart.prototype, {
            sanitizeSVG: function (svg, options) {
                var id = svg.indexOf("</svg>") + 6;
                var html = svg.substr(id);
                svg = svg.substr(0, id);
                if (options && options.exporting && options.exporting.allowHTML && html) {
                    /** @type {string} */
                    html = '<foreignObject x="0" y="0" width="' + options.chart.width + '" height="' + options.chart.height + '"><body xmlns="http://www.w3.org/1999/xhtml">' + html + "</body></foreignObject>";
                    svg = svg.replace("</svg>", html + "</svg>");
                }
                svg = svg.replace(/zIndex="[^"]+"/g, "").replace(/symbolName="[^"]+"/g, "").replace(/jQuery[0-9]+="[^"]+"/g, "").replace(/url\(("|&quot;)(.*?)("|&quot;);?\)/g, "url($2)").replace(/url\([^#]+#/g, "url(#").replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (|NS[0-9]+:)href=/g, " xlink:href=").replace(/\n/, " ").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g, "\u00a0").replace(/&shy;/g, "\u00ad");
                if (this.ieSanitizeSVG) {
                    svg = this.ieSanitizeSVG(svg);
                }
                return svg;
            },
            getChartHTML: function () {
                if (this.styledMode) {
                    this.inlineStyles();
                }
                return this.container.innerHTML;
            },
            getSVG: function (data) {
                var seriesOptions;
                var options = merge(this.options, data);
                options.plotOptions = merge(this.userOptions.plotOptions, data && data.plotOptions);
                options.time = merge(this.userOptions.time, data && data.time);
                var form = createElement("div", null, {
                    position: "absolute",
                    top: "-9999em",
                    width: this.chartWidth + "px",
                    height: this.chartHeight + "px"
                }, doc.body);
                var width = this.renderTo.style.width;
                var cssHeight = this.renderTo.style.height;
                width = options.exporting.sourceWidth || options.chart.width || /px$/.test(width) && parseInt(width, 10) || (options.isGantt ? 800 : 600);
                cssHeight = options.exporting.sourceHeight || options.chart.height || /px$/.test(cssHeight) && parseInt(cssHeight, 10) || 400;
                extend(options.chart, {
                    animation: false,
                    renderTo: form,
                    forExport: true,
                    renderer: "SVGRenderer",
                    width: width,
                    height: cssHeight
                });
                /** @type {boolean} */
                options.exporting.enabled = false;
                delete options.data;
                /** @type {!Array} */
                options.series = [];
                this.series.forEach(function (serie) {
                    seriesOptions = merge(serie.userOptions, {
                        animation: false,
                        enableMouseTracking: false,
                        showCheckbox: false,
                        visible: serie.visible
                    });
                    if (!seriesOptions.isInternal) {
                        options.series.push(seriesOptions);
                    }
                });
                this.axes.forEach(function (axis) {
                    if (!axis.userOptions.internalKey) {
                        axis.userOptions.internalKey = H.uniqueKey();
                    }
                });
                var o = new H.Chart(options, this.callback);
                if (data) {
                    ["xAxis", "yAxis", "series"].forEach(function (p) {
                        var d = {};
                        if (data[p]) {
                            d[p] = data[p];
                            o.update(d);
                        }
                    });
                }
                this.axes.forEach(function (axis) {
                    var self = H.find(o.axes, function (copy) {
                        return copy.options.internalKey === axis.userOptions.internalKey;
                    });
                    var child = axis.getExtremes();
                    var node = child.userMin;
                    child = child.userMax;
                    if (self && ("undefined" !== typeof node && node !== self.min || "undefined" !== typeof child && child !== self.max)) {
                        self.setExtremes(node, child, true, false);
                    }
                });
                width = o.getChartHTML();
                fireEvent(this, "getSVG", {
                    chartCopy: o
                });
                width = this.sanitizeSVG(width, options);
                /** @type {null} */
                options = null;
                o.destroy();
                discardElement(form);
                return width;
            },
            getSVGForExport: function (options, chartOptions) {
                var chartExportingOptions = this.options.exporting;
                return this.getSVG(merge({
                    chart: {
                        borderRadius: 0
                    }
                }, chartExportingOptions.chartOptions, chartOptions, {
                    exporting: {
                        sourceWidth: options && options.sourceWidth || chartExportingOptions.sourceWidth,
                        sourceHeight: options && options.sourceHeight || chartExportingOptions.sourceHeight
                    }
                }));
            },
            getFilename: function () {
                var corpus = this.userOptions.title && this.userOptions.title.text;
                var filename = this.options.exporting.filename;
                if (filename) {
                    return filename.replace(/\//g, "-");
                }
                if ("string" === typeof corpus) {
                    /** @type {string} */
                    filename = corpus.toLowerCase().replace(/<\/?[^>]+(>|$)/g, "").replace(/[\s_]+/g, "-").replace(/[^a-z0-9\-]/g, "").replace(/^[\-]+/g, "").replace(/[\-]+/g, "-").substr(0, 24).replace(/[\-]+$/g, "");
                }
                if (!filename || 5 > filename.length) {
                    /** @type {string} */
                    filename = "chart";
                }
                return filename;
            },
            exportChart: function (options, chartOptions) {
                chartOptions = this.getSVGForExport(options, chartOptions);
                options = merge(this.options.exporting, options);
                H.post(options.url, {
                    filename: options.filename ? options.filename.replace(/\//g, "-") : this.getFilename(),
                    type: options.type,
                    width: options.width || 0,
                    scale: options.scale,
                    svg: chartOptions
                }, options.formAttributes);
            },
            moveContainers: function (map) {
                (this.fixedDiv ? [this.fixedDiv, this.scrollingContainer] : [this.container]).forEach(function (b) {
                    map.appendChild(b);
                });
            },
            beforePrint: function () {
                var owner = doc.body;
                var width = this.options.exporting.printMaxWidth;
                var node = {
                    childNodes: owner.childNodes,
                    origDisplay: [],
                    resetParams: void 0
                };
                /** @type {boolean} */
                this.isPrinting = true;
                this.pointer.reset(null, 0);
                fireEvent(this, "beforePrint");
                if (width && this.chartWidth > width) {
                    /** @type {!Array} */
                    node.resetParams = [this.options.chart.width, void 0, false];
                    this.setSize(width, void 0, false);
                }
                [].forEach.call(node.childNodes, function (collectionNode, i) {
                    if (1 === collectionNode.nodeType) {
                        node.origDisplay[i] = collectionNode.style.display;
                        /** @type {string} */
                        collectionNode.style.display = "none";
                    }
                });
                this.moveContainers(owner);
                this.printReverseInfo = node;
            },
            afterPrint: function () {
                if (this.printReverseInfo) {
                    var childerns = this.printReverseInfo.childNodes;
                    var BROWSER_ENGINES = this.printReverseInfo.origDisplay;
                    var size = this.printReverseInfo.resetParams;
                    this.moveContainers(this.renderTo);
                    [].forEach.call(childerns, function (collectionNode, browser) {
                        if (1 === collectionNode.nodeType) {
                            collectionNode.style.display = BROWSER_ENGINES[browser] || "";
                        }
                    });
                    /** @type {boolean} */
                    this.isPrinting = false;
                    if (size) {
                        this.setSize.apply(this, size);
                    }
                    delete this.printReverseInfo;
                    delete H.printingChart;
                    fireEvent(this, "afterPrint");
                }
            },
            print: function () {
                var chart = this;
                if (!chart.isPrinting) {
                    H.printingChart = chart;
                    if (!H.isSafari) {
                        chart.beforePrint();
                    }
                    setTimeout(function () {
                        win.focus();
                        win.print();
                        if (!H.isSafari) {
                            setTimeout(function () {
                                chart.afterPrint();
                            }, 1E3);
                        }
                    }, 1);
                }
            },
            contextMenu: function (className, options, x, y, width, height, button) {
                var chart = this;
                var navOptions = chart.options.navigation;
                var chartWidth = chart.chartWidth;
                var chartHeight = chart.chartHeight;
                /** @type {string} */
                var cacheName = "cache-" + className;
                var menu = chart[cacheName];
                /** @type {number} */
                var menuPadding = Math.max(width, height);
                if (!menu) {
                    chart.exportContextMenu = chart[cacheName] = menu = createElement("div", {
                        className: className
                    }, {
                        position: "absolute",
                        zIndex: 1E3,
                        padding: menuPadding + "px",
                        pointerEvents: "auto"
                    }, chart.fixedDiv || chart.container);
                    var elem = createElement("ul", {
                        className: "highcharts-menu"
                    }, {
                        listStyle: "none",
                        margin: 0,
                        padding: 0
                    }, menu);
                    if (!chart.styledMode) {
                        css(elem, extend({
                            MozBoxShadow: "3px 3px 10px #888",
                            WebkitBoxShadow: "3px 3px 10px #888",
                            boxShadow: "3px 3px 10px #888"
                        }, navOptions.menuStyle));
                    }
                    /**
                     * @return {undefined}
                     */
                    menu.hideMenu = function () {
                        css(menu, {
                            display: "none"
                        });
                        if (button) {
                            button.setState(0);
                        }
                        /** @type {boolean} */
                        chart.openMenu = false;
                        css(chart.renderTo, {
                            overflow: "hidden"
                        });
                        H.clearTimeout(menu.hideTimer);
                        fireEvent(chart, "exportMenuHidden");
                    };
                    chart.exportEvents.push(addEvent(menu, "mouseleave", function () {
                        menu.hideTimer = win.setTimeout(menu.hideMenu, 500);
                    }), addEvent(menu, "mouseenter", function () {
                        H.clearTimeout(menu.hideTimer);
                    }), addEvent(doc, "mouseup", function (e) {
                        if (!chart.pointer.inClass(e.target, className)) {
                            menu.hideMenu();
                        }
                    }), addEvent(menu, "click", function () {
                        if (chart.openMenu) {
                            menu.hideMenu();
                        }
                    }));
                    options.forEach(function (item) {
                        if ("string" === typeof item) {
                            item = chart.options.exporting.menuItemDefinitions[item];
                        }
                        if (display(item, true)) {
                            if (item.separator) {
                                var node = createElement("hr", null, null, elem);
                            } else {
                                node = createElement("li", {
                                    className: "highcharts-menu-item",
                                    onclick: function (event) {
                                        if (event) {
                                            event.stopPropagation();
                                        }
                                        menu.hideMenu();
                                        if (item.onclick) {
                                            item.onclick.apply(chart, arguments);
                                        }
                                    },
                                    innerHTML: item.text || chart.options.lang[item.textKey]
                                }, null, elem);
                                if (!chart.styledMode) {
                                    /**
                                     * @return {undefined}
                                     */
                                    node.onmouseover = function () {
                                        css(this, navOptions.menuItemHoverStyle);
                                    };
                                    /**
                                     * @return {undefined}
                                     */
                                    node.onmouseout = function () {
                                        css(this, navOptions.menuItemStyle);
                                    };
                                    css(node, extend({
                                        cursor: "pointer"
                                    }, navOptions.menuItemStyle));
                                }
                            }
                            chart.exportDivElements.push(node);
                        }
                    });
                    chart.exportDivElements.push(elem, menu);
                    chart.exportMenuWidth = menu.offsetWidth;
                    chart.exportMenuHeight = menu.offsetHeight;
                }
                options = {
                    display: "block"
                };
                if (x + chart.exportMenuWidth > chartWidth) {
                    /** @type {string} */
                    options.right = chartWidth - x - width - menuPadding + "px";
                } else {
                    /** @type {string} */
                    options.left = x - menuPadding + "px";
                }
                if (y + height + chart.exportMenuHeight > chartHeight && "top" !== button.alignOptions.verticalAlign) {
                    /** @type {string} */
                    options.bottom = chartHeight - y - menuPadding + "px";
                } else {
                    /** @type {string} */
                    options.top = y + height - menuPadding + "px";
                }
                css(menu, options);
                css(chart.renderTo, {
                    overflow: ""
                });
                /** @type {boolean} */
                chart.openMenu = true;
                fireEvent(chart, "exportMenuShown");
            },
            addButton: function (options) {
                var chart = this;
                var renderer = chart.renderer;
                var btnOptions = merge(chart.options.navigation.buttonOptions, options);
                var onclick = btnOptions.onclick;
                var menuItems = btnOptions.menuItems;
                var symbolSize = btnOptions.symbolSize || 12;
                if (!chart.btnCount) {
                    /** @type {number} */
                    chart.btnCount = 0;
                }
                if (!chart.exportDivElements) {
                    /** @type {!Array} */
                    chart.exportDivElements = [];
                    /** @type {!Array} */
                    chart.exportSVGElements = [];
                }
                if (false !== btnOptions.enabled) {
                    var attr = btnOptions.theme;
                    var states = attr.states;
                    var hover = states && states.hover;
                    states = states && states.select;
                    var callback;
                    if (!chart.styledMode) {
                        attr.fill = pick(attr.fill, "#ffffff");
                        attr.stroke = pick(attr.stroke, "none");
                    }
                    delete attr.states;
                    if (onclick) {
                        /**
                         * @param {!Event} e
                         * @return {undefined}
                         */
                        callback = function (e) {
                            if (e) {
                                e.stopPropagation();
                            }
                            onclick.call(chart, e);
                        };
                    } else {
                        if (menuItems) {
                            /**
                             * @param {!Event} event
                             * @return {undefined}
                             */
                            callback = function (event) {
                                if (event) {
                                    event.stopPropagation();
                                }
                                chart.contextMenu(button.menuClassName, menuItems, button.translateX, button.translateY, button.width, button.height, button);
                                button.setState(2);
                            };
                        }
                    }
                    if (btnOptions.text && btnOptions.symbol) {
                        attr.paddingLeft = pick(attr.paddingLeft, 25);
                    } else {
                        if (!btnOptions.text) {
                            extend(attr, {
                                width: btnOptions.width,
                                height: btnOptions.height,
                                padding: 0
                            });
                        }
                    }
                    if (!chart.styledMode) {
                        /** @type {string} */
                        attr["stroke-linecap"] = "round";
                        attr.fill = pick(attr.fill, "#ffffff");
                        attr.stroke = pick(attr.stroke, "none");
                    }
                    var button = renderer.button(btnOptions.text, 0, 0, callback, attr, hover, states).addClass(options.className).attr({
                        title: pick(chart.options.lang[btnOptions._titleKey || btnOptions.titleKey], "")
                    });
                    button.menuClassName = options.menuClassName || "highcharts-menu-" + chart.btnCount++;
                    if (btnOptions.symbol) {
                        var symbol = renderer.symbol(btnOptions.symbol, btnOptions.symbolX - symbolSize / 2, btnOptions.symbolY - symbolSize / 2, symbolSize, symbolSize, {
                            width: symbolSize,
                            height: symbolSize
                        }).addClass("highcharts-button-symbol").attr({
                            zIndex: 1
                        }).add(button);
                        if (!chart.styledMode) {
                            symbol.attr({
                                stroke: btnOptions.symbolStroke,
                                fill: btnOptions.symbolFill,
                                "stroke-width": btnOptions.symbolStrokeWidth || 1
                            });
                        }
                    }
                    button.add(chart.exportingGroup).align(extend(btnOptions, {
                        width: button.width,
                        x: pick(btnOptions.x, chart.buttonOffset)
                    }), true, "spacingBox");
                    chart.buttonOffset += (button.width + btnOptions.buttonSpacing) * ("right" === btnOptions.align ? -1 : 1);
                    chart.exportSVGElements.push(button, symbol);
                }
            },
            destroyExport: function (e) {
                var chart = e ? e.target : this;
                e = chart.exportSVGElements;
                var exportDivElements = chart.exportDivElements;
                var panes = chart.exportEvents;
                var cacheName;
                if (e) {
                    e.forEach(function (elem, i) {
                        if (elem) {
                            /** @type {null} */
                            elem.onclick = elem.ontouchstart = null;
                            /** @type {string} */
                            cacheName = "cache-" + elem.menuClassName;
                            if (chart[cacheName]) {
                                delete chart[cacheName];
                            }
                            chart.exportSVGElements[i] = elem.destroy();
                        }
                    });
                    /** @type {number} */
                    e.length = 0;
                }
                if (chart.exportingGroup) {
                    chart.exportingGroup.destroy();
                    delete chart.exportingGroup;
                }
                if (exportDivElements) {
                    exportDivElements.forEach(function (elem, i) {
                        H.clearTimeout(elem.hideTimer);
                        removeEvent(elem, "mouseleave");
                        /** @type {null} */
                        chart.exportDivElements[i] = elem.onmouseout = elem.onmouseover = elem.ontouchstart = elem.onclick = null;
                        discardElement(elem);
                    });
                    /** @type {number} */
                    exportDivElements.length = 0;
                }
                if (panes) {
                    panes.forEach(function (unbind) {
                        unbind();
                    });
                    /** @type {number} */
                    panes.length = 0;
                }
            }
        });
        /** @type {!Array<string>} */
        SVGRenderer.prototype.inlineToAttributes = "fill stroke strokeLinecap strokeLinejoin strokeWidth textAnchor x y".split(" ");
        /** @type {!Array} */
        SVGRenderer.prototype.inlineBlacklist = [/-/, /^(clipPath|cssText|d|height|width)$/, /^font$/, /[lL]ogical(Width|Height)$/, /perspective/, /TapHighlightColor/, /^transition/, /^length$/];
        /** @type {!Array} */
        SVGRenderer.prototype.unstyledElements = ["clipPath", "defs", "desc"];
        /**
         * @return {undefined}
         */
        Chart.prototype.inlineStyles = function () {
            /**
             * @param {string} b
             * @return {?}
             */
            function hyphenate(b) {
                return b.replace(/([A-Z])/g, function (a, p_Interval) {
                    return "-" + p_Interval.toLowerCase();
                });
            }
            /**
             * @param {!Node} node
             * @return {undefined}
             */
            function recurse(node) {
                /**
                 * @param {string} value
                 * @param {string} prop
                 * @return {undefined}
                 */
                function filterStyles(value, prop) {
                    /** @type {boolean} */
                    blacklisted = whitelisted = false;
                    if (whitelist) {
                        i = whitelist.length;
                        for (; i-- && !whitelisted;) {
                            whitelisted = whitelist[i].test(prop);
                        }
                        /** @type {boolean} */
                        blacklisted = !whitelisted;
                    }
                    if ("transform" === prop && "none" === value) {
                        /** @type {boolean} */
                        blacklisted = true;
                    }
                    i = blacklist.length;
                    for (; i-- && !blacklisted;) {
                        blacklisted = blacklist[i].test(prop) || "function" === typeof value;
                    }
                    if (!(blacklisted || objects[prop] === value && "svg" !== node.nodeName || ret[node.nodeName][prop] === value)) {
                        if (-1 !== inlineToAttributes.indexOf(prop)) {
                            node.setAttribute(hyphenate(prop), value);
                        } else {
                            suffix = suffix + (hyphenate(prop) + ":" + value + ";");
                        }
                    }
                }
                /** @type {string} */
                var suffix = "";
                var blacklisted;
                var whitelisted;
                var i;
                if (1 === node.nodeType && -1 === unstyledElements.indexOf(node.nodeName)) {
                    var data = win.getComputedStyle(node, null);
                    var objects = "svg" === node.nodeName ? {} : win.getComputedStyle(node.parentNode, null);
                    if (!ret[node.nodeName]) {
                        pre = document.getElementsByTagName("svg")[0];
                        var dummy = document.createElementNS(node.namespaceURI, node.nodeName);
                        pre.appendChild(dummy);
                        ret[node.nodeName] = merge(win.getComputedStyle(dummy, null));
                        if ("text" === node.nodeName) {
                            delete ret.text.fill;
                        }
                        pre.removeChild(dummy);
                    }
                    if (isAOS || isDangkr) {
                        var p;
                        for (p in data) {
                            filterStyles(data[p], p);
                        }
                    } else {
                        objectEach(data, filterStyles);
                    }
                    if (suffix) {
                        data = node.getAttribute("style");
                        node.setAttribute("style", (data ? data + ";" : "") + suffix);
                    }
                    if ("svg" === node.nodeName) {
                        node.setAttribute("stroke-width", "1px");
                    }
                    if ("text" !== node.nodeName) {
                        [].forEach.call(node.children || node.childNodes, recurse);
                    }
                }
            }
            var renderer = this.renderer;
            var inlineToAttributes = renderer.inlineToAttributes;
            var blacklist = renderer.inlineBlacklist;
            var whitelist = renderer.inlineWhitelist;
            var unstyledElements = renderer.unstyledElements;
            var ret = {};
            var pre;
            renderer = doc.createElement("iframe");
            css(renderer, {
                width: "1px",
                height: "1px",
                visibility: "hidden"
            });
            doc.body.appendChild(renderer);
            var document = renderer.contentWindow.document;
            document.open();
            document.write('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
            document.close();
            recurse(this.container.querySelector("svg"));
            pre.parentNode.removeChild(pre);
        };
        /**
         * @param {(Object|number)} event
         * @param {number} name
         * @param {!Object} callback
         * @param {number} index
         * @return {?}
         */
        symbols.menu = function (event, name, callback, index) {
            return ["M", event, name + 2.5, "L", event + callback, name + 2.5, "M", event, name + index / 2 + .5, "L", event + callback, name + index / 2 + .5, "M", event, name + index - 1.5, "L", event + callback, name + index - 1.5];
        };
        /**
         * @param {!Array} obj
         * @param {number} options
         * @param {string} index
         * @param {number} color
         * @return {?}
         */
        symbols.menuball = function (obj, options, index, color) {
            /** @type {!Array} */
            obj = [];
            /** @type {number} */
            color = color / 3 - 2;
            return obj = obj.concat(this.circle(index - color, options, color, color), this.circle(index - color, options + color + 4, color, color), this.circle(index - color, options + 2 * (color + 4), color, color));
        };
        /**
         * @return {undefined}
         */
        Chart.prototype.renderExporting = function () {
            var chart = this;
            var exportingOptions = chart.options.exporting;
            var buttons = exportingOptions.buttons;
            var d = chart.isDirtyExporting || !chart.exportSVGElements;
            /** @type {number} */
            chart.buttonOffset = 0;
            if (chart.isDirtyExporting) {
                chart.destroyExport();
            }
            if (d && false !== exportingOptions.enabled) {
                /** @type {!Array} */
                chart.exportEvents = [];
                chart.exportingGroup = chart.exportingGroup || chart.renderer.g("exporting-group").attr({
                    zIndex: 3
                }).add();
                objectEach(buttons, function (value) {
                    chart.addButton(value);
                });
                /** @type {boolean} */
                chart.isDirtyExporting = false;
            }
            addEvent(chart, "destroy", chart.destroyExport);
        };
        addEvent(Chart, "init", function () {
            var chart = this;
            chart.exporting = {
                update: function (val, data) {
                    /** @type {boolean} */
                    chart.isDirtyExporting = true;
                    merge(true, chart.options.exporting, val);
                    if (pick(data, true)) {
                        chart.redraw();
                    }
                }
            };
            self.addUpdate(function (revLimit, context) {
                /** @type {boolean} */
                chart.isDirtyExporting = true;
                merge(true, chart.options.navigation, revLimit);
                if (pick(context, true)) {
                    chart.redraw();
                }
            }, chart);
        });
        Chart.prototype.callbacks.push(function (chart) {
            chart.renderExporting();
            addEvent(chart, "redraw", chart.renderExporting);
        });
    });
    k(t, "masters/modules/exporting.src.js", [], function () {
    });
});
