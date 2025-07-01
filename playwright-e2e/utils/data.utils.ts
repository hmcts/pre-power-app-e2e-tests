import { faker } from '@faker-js/faker';
import { CaseDetailsType } from '../page-objects/pages';

export class DataUtils {
  /**
   * Generates random case details with a specified number of defendants and witnesses.
   * @param numberOfDefendants - The number of defendants to generate.
   * @param numberOfWitnesses - The number of witnesses to generate.
   * @returns An object containing the case reference, defendants, and witnesses.
   */
  generateRandomCaseDetails(numberOfDefendants: number, numberOfWitnesses: number): CaseDetailsType {
    if (numberOfDefendants <= 0 || numberOfWitnesses <= 0) {
      throw new Error('Both numberOfDefendants and numberOfWitnesses must be greater than 0');
    }

    return {
      caseReference: this.generateRandomCaseReference(),
      defendants: this.generateRandomNames('fullName', numberOfDefendants),
      witnesses: this.generateRandomNames('firstName', numberOfWitnesses),
    };
  }

  /**
   * Generates a random case reference number.
   * @returns A string representing the case reference number.
   */
  generateRandomCaseReference(): string {
    return `PR-${Date.now().toString().slice(-10)}`;
  }

  /**
   * Generates an array of random names.
   * @param type - The type of name to generate ('firstName' or 'fullName').
   * @param numberOfNamesToGenerate - The number of names to generate.
   * @returns An array of generated names.
   */
  generateRandomNames(type: 'firstName' | 'fullName', numberOfNamesToGenerate: number): string[] {
    return Array.from({ length: numberOfNamesToGenerate }, () => {
      let name: string;
      if (type === 'firstName') {
        name = faker.person.firstName();
      } else {
        name = `${faker.person.firstName()} ${faker.person.lastName()}`;
      }
      return name.trim().slice(0, 25);
    });
  }
}
