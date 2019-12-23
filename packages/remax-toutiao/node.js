"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = __importStar(require("path"));
var plugin = function () {
    return {
        extensions: {
            jsHelper: '',
            style: '.ttss',
            template: '.ttml',
        },
        getEntries: function (_a) {
            var remaxOptions = _a.remaxOptions, appManifest = _a.appManifest, getEntryPath = _a.getEntryPath;
            var _b;
            var ROOT_DIR = path.join(remaxOptions.cwd, remaxOptions.rootDir);
            var appPath = path.join(ROOT_DIR, 'app');
            var pages = appManifest.pages, _c = appManifest.subpackages, subpackages = _c === void 0 ? [] : _c, _d = appManifest.tabBar, tabBar = _d === void 0 ? { list: [] } : _d;
            if (!pages || pages.length === 0) {
                throw new Error('app.config.js|ts 并未配置页面参数');
            }
            var entries = {
                app: getEntryPath(appPath),
                pages: [],
                images: [],
            };
            // 页面
            entries.pages = pages.reduce(function (ret, page) {
                return __spreadArrays(ret, [getEntryPath(path.join(ROOT_DIR, page))]).filter(function (page) { return !!page; });
            }, []);
            // 分包页面
            subpackages.forEach(function (pack) {
                entries.pages = entries.pages.concat(pack.pages.reduce(function (ret, page) {
                    return __spreadArrays(ret, [
                        getEntryPath(path.join(ROOT_DIR, pack.root, page)),
                    ]).filter(function (page) { return !!page; });
                }, []));
            });
            // tabbar 中的图片
            entries.images = (((_b = tabBar) === null || _b === void 0 ? void 0 : _b.list) || [])
                .reduce(function (images, tab) { return __spreadArrays(images, [
                tab.iconPath,
                tab.selectedIconPath,
            ]); }, [])
                .filter(function (image) { return !!image; })
                .reduce(function (paths, image) { return __spreadArrays(paths, [path.join(ROOT_DIR, image)]); }, []);
            return entries;
        },
    };
};
exports.default = plugin;
