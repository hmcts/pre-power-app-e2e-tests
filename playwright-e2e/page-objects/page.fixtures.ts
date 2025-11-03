import { PowerAppPageFixtures, powerAppPageFixtures } from './pre-power-app/power-app-page.fixtures.js';
import { CvpPageFixtures, cvpPageFixtures } from './cvp/cvp-page.fixtures.js';
import { PortalPageFixtures, portalPageFixtures } from './pre-portal/portal-page.fixtures.js';

export type PageFixtures = PowerAppPageFixtures & CvpPageFixtures & PortalPageFixtures;

export const pageFixtures = {
  ...powerAppPageFixtures,
  ...cvpPageFixtures,
  ...portalPageFixtures,
};
