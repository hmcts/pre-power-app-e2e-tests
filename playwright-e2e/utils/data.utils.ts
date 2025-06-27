import { faker } from '@faker-js/faker';
import { CaseDetailsType } from '../page-objects/pages';

export class DataUtils {
  generateRandomCaseDetails(numberOfDefendants: number, numberOfWitnesses: number): CaseDetailsType {
    if (numberOfDefendants <= 0 || numberOfWitnesses <= 0) {
      throw new Error('Both numberOfDefendants and numberOfWitnesses must be greater than 0');
    }

    const defendants: string[] = Array.from({ length: numberOfDefendants }, () => {
      const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      return name.trim().slice(0, 25);
    });

    const witnesses: string[] = Array.from({ length: numberOfWitnesses }, () => {
      const name = faker.person.firstName();
      return name.trim().slice(0, 25);
    });

    return {
      caseReference: `PR-${Date.now().toString().slice(-10)}`,
      defendants,
      witnesses,
    };
  }
}
