import { PowerAppPageFixtures, powerAppPageFixtures } from './power-app/power-app-page.fixtures.js';
import { CvpPageFixtures, cvpPageFixtures } from './cvp/cvp-page.fixtures.js';

export type PageFixtures = PowerAppPageFixtures & CvpPageFixtures;

export const pageFixtures = {
  ...powerAppPageFixtures,
  ...cvpPageFixtures,
};
