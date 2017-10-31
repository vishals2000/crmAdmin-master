import { platformBrowser } from '@angular/platform-browser';
import { ProdConfig } from './blocks/config/prod.config';
import { CrmAdminAppModuleNgFactory } from '../../../../build/aot/src/main/webapp/app/app.module.ngfactory';

ProdConfig();

platformBrowser().bootstrapModuleFactory(CrmAdminAppModuleNgFactory)
.then((success) => console.log(`Application started`))
.catch((err) => console.error(err));
