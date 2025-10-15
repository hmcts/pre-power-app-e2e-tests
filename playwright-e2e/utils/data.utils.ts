import { faker } from '@faker-js/faker';
import { BaseCaseDetails } from '../types';
import { DateTime } from 'luxon';

export class DataUtils {
  /**
   * Generates random case details with a specified number of defendants and witnesses.
   * @param numberOfDefendants - The number of defendants to generate.
   * @param numberOfWitnesses - The number of witnesses to generate.
   * @returns An object containing the case reference, defendants, and witnesses.
   */
  generateRandomCaseDetails(numberOfDefendants: number, numberOfWitnesses: number): BaseCaseDetails {
    if (numberOfDefendants <= 0 || numberOfWitnesses <= 0) {
      throw new Error('Both numberOfDefendants and numberOfWitnesses must be greater than 0');
    }

    return {
      caseReference: this.generateRandomCaseReference(),
      defendantNames: this.generateRandomNames('fullName', numberOfDefendants),
      witnessNames: this.generateRandomNames('firstName', numberOfWitnesses),
    };
  }

  /**
   * Generates a random case reference number.
   * @returns A string representing the case reference number.
   */
  generateRandomCaseReference(): string {
    const randomDigits = faker.number.int({ min: 1000000000, max: 9999999999 });
    return `PR-${randomDigits}`;
  }

  /**
   * Generates an array of random names.
   * @param type - The type of name to generate ('firstName' or 'fullName').
   * @param numberOfNamesToGenerate - The number of names to generate.
   * @returns An array of generated names.
   */
  generateRandomNames(type: 'firstName' | 'fullName', numberOfNamesToGenerate: number): string[] {
    return Array.from({ length: numberOfNamesToGenerate }, () => {
      const firstName = faker.person.firstName().trim().slice(0, 25);
      const lastName = faker.person.lastName().trim().slice(0, 25);
      let name: string;
      if (type === 'firstName') {
        name = firstName;
      } else {
        name = `${firstName} ${lastName}`;
      }
      return name;
    });
  }

  /**
   * Get formatted date with abbreviated day and month.
   * @param offset - An object specifying the number of days, months, or years to offset from the current date.
   * (positive = future, negative = past)
   * @returns A string representing the formatted date (e.g., "Mon Jan 01 2024").
   */
  getShortDateWithAbbreviatedDayMonth(offset: { days?: number; months?: number; years?: number } = {}): string {
    let date = DateTime.now();

    if (offset.days) {
      date = date.plus({ days: offset.days });
    }
    if (offset.months) {
      date = date.plus({ months: offset.months });
    }
    if (offset.years) {
      date = date.plus({ years: offset.years });
    }

    return date.toFormat('ccc LLL dd yyyy');
  }
}
