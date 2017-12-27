import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CrmAdminMessageContentModule } from './message-content/message-content.module';
import { CrmAdminCampaignTemplateModule } from './campaign-template/campaign-template.module';
import { CrmAdminFeProductModule } from './fe-product/fe-product.module';
import { CrmAdminFilterCriteriaModule } from './filter-criteria/filter-criteria.module';
import { CrmAdminEventCriteriaModule } from './event-criteria/event-criteria.module';
import { CrmAdminTagCriteriaModule } from './tag-criteria/tag-criteria.module';
import { CrmAdminTargetGroupCriteriaModule } from './target-group-criteria/target-group-criteria.module';
import { CrmAdminProjectsModule } from './projects/projects.module';
import { CrmAdminCampaignsModule } from './campaigns/campaigns.module';
import { CrmAdminCampaignGroupModule } from './campaign-group/campaign-group.module';
import { CrmAdminAppsModule } from './apps/apps.module';
import { CrmAdminAudienceSegmentsModule } from './audience-segments/audience-segments.module';
import { CrmAdminUploadSegmentsModule } from './upload-segments/upload-segments.module';
import { CrmAdminCampaignStatModule } from './campaign-stat/campaign-stat.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        CrmAdminMessageContentModule,
        CrmAdminCampaignTemplateModule,
        CrmAdminFeProductModule,
        CrmAdminFilterCriteriaModule,
        CrmAdminEventCriteriaModule,
        CrmAdminTagCriteriaModule,
        CrmAdminTargetGroupCriteriaModule,
        CrmAdminProjectsModule,
        CrmAdminCampaignsModule,
        CrmAdminCampaignGroupModule,
        CrmAdminAppsModule,
        CrmAdminAudienceSegmentsModule,
        CrmAdminUploadSegmentsModule,
        CrmAdminCampaignStatModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CrmAdminEntityModule {}
