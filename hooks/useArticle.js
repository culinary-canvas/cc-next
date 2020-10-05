"use strict";
exports.__esModule = true;
exports.useArticle = void 0;
var react_1 = require("react");
var useUnmount_1 = require("./useUnmount");
var useAutorun_1 = require("./useAutorun");
var AppEnvironment_1 = require("../services/AppEnvironment");
var Article_service_1 = require("../domain/Article/Article.service");
function useArticle(titleForUrl) {
    var env = AppEnvironment_1.useEnv();
    var _a = react_1.useState(), article = _a[0], setArticle = _a[1];
    useAutorun_1.useAutorun(function () {
        if (!env.articleStore.current ||
            env.articleStore.current.titleForUrl !== titleForUrl) {
            if (!!titleForUrl) {
                env.articleStore.getByTitleForUrl(titleForUrl).then(function (a) {
                    setArticle(a);
                    env.articleStore.setCurrent(a);
                });
            }
            else {
                var a = Article_service_1.ArticleService.create();
                setArticle(a);
                env.articleStore.setCurrent(a);
            }
        }
        else {
            setArticle(env.articleStore.current);
        }
    }, [env.articleStore, titleForUrl]);
    useUnmount_1.useUnmount(function () {
        env.articleStore.setCurrent(null);
    });
    return article;
}
exports.useArticle = useArticle;
