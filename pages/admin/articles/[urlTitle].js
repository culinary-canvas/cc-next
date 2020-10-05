"use strict";
exports.__esModule = true;
var react_1 = require("react");
var mobx_react_1 = require("mobx-react");
var AppEnvironment_1 = require("../../../services/AppEnvironment");
var Article_service_1 = require("../../../domain/Article/Article.service");
var useFormControl_1 = require("../../../hooks/useFormControl");
var useUnmount_1 = require("../../../hooks/useUnmount");
var importHelpers_1 = require("../../../services/importHelpers");
var AddSection_1 = require("../../../components/AddSection/AddSection");
var Section_1 = require("../../../components/Section/Section");
var router_1 = require("next/router");
var ArticleForm = mobx_react_1.observer(function () {
    var env = AppEnvironment_1.useEnv();
    // TODO nav
    var router = router_1.useRouter();
    var urlTitle = router.query.urlTitle;
    console.log(urlTitle);
    var _a = react_1.useState(), article = _a[0], setArticle = _a[1];
    react_1.useEffect(function () {
        if (!article) {
            if (!!urlTitle) {
                env.articleStore.getByTitleForUrl(urlTitle).then(function (a) { return setArticle(a); });
            }
            else {
                setArticle(Article_service_1.ArticleService.create());
            }
        }
    }, [article, env.articleStore, urlTitle]);
    var formControl = useFormControl_1.useFormControl(article, [
        { field: 'title', required: true },
    ]);
    react_1.useEffect(function () {
        !!formControl && env.adminSidebarStore.init(formControl);
    }, [env.adminSidebarStore, formControl]);
    react_1.useEffect(function () {
        env.adminSidebarStore.open();
    }, [env.adminSidebarStore]);
    react_1.useEffect(function () { }, [article]);
    useUnmount_1.useUnmount(function () {
        env.adminSidebarStore.onDestroy();
    });
    return (<main className={importHelpers_1.classnames('container', 'article')}>
      <article className={importHelpers_1.classnames('content', 'article', "type-" + (article === null || article === void 0 ? void 0 : article.type))}>
        {article === null || article === void 0 ? void 0 : article.sortedSections.map(function (section, i) { return (<Section_1.Section first={i === 0} key={section.sortOrder} section={section} edit/>); })}
      </article>

      <AddSection_1.AddSection onSelect={function (section) {
        Article_service_1.ArticleService.addSection(section, article);
        env.adminSidebarStore.setSection(section);
    }}/>
    </main>);
});
exports["default"] = ArticleForm;
