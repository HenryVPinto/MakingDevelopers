const availableLanguages = $config().languages.list.join('|');
const defaultApp = $config().app.default;

import i18n from './lib/i18n';
import utils from './lib/utils';

import homeController from './app/home/home.controller';
import dashboardController from './app/dashboard/dashboard.controller';

export default (app) => {
  const defaultController = getDefaultController(defaultApp);

  // Loading isMobile, basePath, currentLanguage and __
  app.use((req, res, next) => {
    res.__ = res.locals.__ = i18n.load(i18n.getCurrentLanguage(req.url));
    res.locals.basePath = res.locals.config.basePath;
    res.locals.config.basePath = `${$config().baseUrl}${i18n.getLanguagePath(req.url)}`;
    res.locals.currentLanguage = i18n.getCurrentLanguage(req.url);
    res.locals.isMobile = utils.isMobile(req.headers['user-agent']);

    next();
  });

  // Default css and js
  app.use((req, res, next) => {
    res.locals.css = [
      '/css/style.css'
    ];
    res.locals.topJs = [];
    res.locals.bottomJs = [];

    next();
  });

  // Controllers dispatch
  app.use('/', defaultController);
  app.use(`/:language(${availableLanguages})`, defaultController);
  app.use(`/:language(${availableLanguages})/home`, homeController);
  app.use(`/:language(${availableLanguages})/dashboard`, dashboardController);

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // development error handler
  if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
};

function getDefaultController(app) {
  switch (app) {
    case 'home':
      return homeController;
    case 'dashboard':
      return dashboardController;
    default:
      return homeController;
  }
}
