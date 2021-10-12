import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MergeSuggestionService {

  specialEmailNames = ['github', 'me'];
  nameParts;

  constructor() {
  }

  namesMatch(firstAuthorNameParts, secondAuthorNameParts) {
    let matchCounter = 0;
    let partialMatchCounter = 0;

    for (let firstIndex = 0; firstIndex < firstAuthorNameParts.length; firstIndex++) {
      if (this.fragmentTooShort(firstAuthorNameParts[firstIndex])) continue;
      if (firstIndex > 0 && firstAuthorNameParts[firstIndex] === firstAuthorNameParts[firstIndex - 1])
        continue;

      for (let secondIndex = 0; secondIndex < secondAuthorNameParts.length; secondIndex++) {
        if (this.fragmentTooShort(secondAuthorNameParts[secondIndex])) continue;
        if (secondIndex > 0 && secondAuthorNameParts[secondIndex] === secondAuthorNameParts[secondIndex - 1])
          continue;


        if (firstAuthorNameParts[firstIndex] === secondAuthorNameParts[secondIndex]) matchCounter++;

        if ((firstAuthorNameParts.length == 1) && this.nameContainsFragment(firstAuthorNameParts[0], secondAuthorNameParts[secondIndex]))
          partialMatchCounter++;
      }

      if ((secondAuthorNameParts.length == 1) && this.nameContainsFragment(secondAuthorNameParts[0], firstAuthorNameParts[firstIndex]))
        partialMatchCounter++;

    }

    return (matchCounter == Math.min(firstAuthorNameParts.length, secondAuthorNameParts.length)) ||
      (partialMatchCounter >= 2);
  }

  nameContainsFragment(name, fragment) {
    return name.length() >= 6 && !this.fragmentTooShort(fragment) && name.contains(fragment);
  }

  fragmentTooShort(fragment) {
    return fragment.length < 3;
  }

  identitiesAreSimilar(firstIdentity, secondIdentity) {
    return this.firstNameIsSimilar(firstIdentity.firstName, secondIdentity.lastName) || this.lastNameIsSimilar(firstIdentity.firstName, secondIdentity.lastName) || this.emailIsSimilar(firstIdentity.email, secondIdentity.email);
  }

  firstNameIsSimilar(firstname1, firstname2) {
    return this.getCleanSortedName(firstname1).equals(this.getCleanSortedName(firstname2));
  }

  lastNameIsSimilar(lastname1, lastname2) {
    return this.getCleanSortedName(lastname1).equals(this.getCleanSortedName(lastname2));
  }

  emailIsSimilar(email1, email2) {
    return this.getCleanSortedEmail(email1).equals(this.getCleanSortedEmail(email2));
  }

  getCleanSortedName(name) {
    return name.toLowerCase();
  }

  getCleanSortedEmail(email) {
    let emailNameDomain = email.split("@");
    let emailName = emailNameDomain[0];
    let emailDomain = emailNameDomain.length > 1 ? emailNameDomain[1] : null;
    if (this.specialEmailNames.includes(emailName) && emailDomain != null)
      emailName = emailDomain.substring(0, emailDomain.lastIndexOf('.'));
    let emailParts = email.split(emailName.toLowerCase(), 0);
    if (emailParts.length == 0)
      return emailName.toLowerCase();
    return emailParts;
  }

  getNameParts(name) {
    if (this.nameParts != null)
      return this.nameParts;
    this.nameParts = name.split(name.toLowerCase(), 0);
    if (this.nameParts.length == 0)
      return name.toLowerCase();
    return this.nameParts;
  }

  getMergeSuggestions() {
    let smartMergeSuggestions = [];
    let authorIDs = [];
    while (!(authorIDs.length === 0)) {
      let currentMergeGroup = [];
      let newMembers = authorIDs.splice(0, 1);
      do {
        currentMergeGroup.concat(newMembers);
        newMembers = this.removeSimilar(newMembers, authorIDs);
      } while (!(newMembers.length === 0));
      if (currentMergeGroup.length > 1)
        smartMergeSuggestions.push(currentMergeGroup);
    }
    return smartMergeSuggestions;
  }

  removeSimilar(mergeGroup, allAuthorIDs) {
    return mergeGroup.map(engineerId => allAuthorIDs.filter(otherId => this.identitiesAreSimilar(engineerId, otherId)))
  }


}
