import { Injectable } from '@angular/core';
import { Identity } from '../data/identity';

@Injectable({
  providedIn: 'root'
})
export class MergeSuggestionService {

  constructor() {
  }

  checkBot(email: string): boolean {
    return email.includes('newsletter') || email.includes('noreply') || email.includes('marketing') || email.includes('events') || email.includes('support');
  }

  identitiesAreSimilar(firstIdentity: Identity, secondIdentity: Identity): boolean {
    return this.firstNameIsSimilar(firstIdentity?.firstName, secondIdentity?.firstName) || this.lastNameIsSimilar(firstIdentity?.lastName, secondIdentity?.lastName) ||
      this.emailIsSimilar(firstIdentity?.email, secondIdentity?.email) || this.usernameIsSimilar(firstIdentity?.username, secondIdentity?.username);
  }

  firstNameIsSimilar(firstname1: string, firstname2: string): boolean {
    if (firstname1 !== null || firstname2 !== null) {
      return this.getCleanSortedName(firstname1) === this.getCleanSortedName(firstname2);
    }
    return false;
  }

  lastNameIsSimilar(lastname1: string, lastname2: string): boolean {
    if (lastname1 !== null || lastname2 !== null) {
      return this.getCleanSortedName(lastname1) === this.getCleanSortedName(lastname2);
    }
    return false;
  }

  emailIsSimilar(email1: string, email2: string): boolean {
    if (email1 !== null || email2 !== null) {
      return this.getCleanSortedEmail(email1) === this.getCleanSortedEmail(email2);
    }
    return false;
  }

  usernameIsSimilar(username1: string, username2: string): boolean {
    if (username1 !== null || username2 !== null) {
      return this.getCleanSortedUsername(username1) === this.getCleanSortedUsername(username2);
    }
    return false;
  }

  getCleanSortedName(name: string): string {
    return name?.toLowerCase();
  }

  getCleanSortedEmail(email: string) {
    let emailNameDomain = email?.split('@');
    if (emailNameDomain) {
      let emailNameParts = emailNameDomain[0]?.split('.');
      let emailNameParts1OnlyChars = emailNameParts[0]?.replace(/[0-9]/g, '');
      let emailNameParts2OnlyChars = emailNameParts[1]?.replace(/[0-9]/g, '');
      let emailParts;
      emailNameParts2OnlyChars ? emailParts = emailNameParts1OnlyChars.concat(emailNameParts2OnlyChars) : emailParts = emailNameParts1OnlyChars;
      return emailParts;
    }
  }

  getCleanSortedUsername(username: string) {
    let usernameParts;
    let cleanUsername;
    if (username?.includes('.')) {
      usernameParts = username?.split('.');
      let usernameParts1OnlyChars = usernameParts[0]?.replace(/[0-9]/g, '');
      let usernameParts2OnlyChars = usernameParts[1]?.replace(/[0-9]/g, '');
      usernameParts2OnlyChars ? cleanUsername = usernameParts1OnlyChars.concat(usernameParts2OnlyChars) : cleanUsername = usernameParts1OnlyChars;
    } else if (username?.includes('-') || username?.includes('_')) {
      username.includes('-') ? usernameParts = username?.split('-') : usernameParts = username?.split('_');
      let usernameParts1OnlyChars = usernameParts[0]?.replace(/[0-9]/g, '');
      let usernameParts2OnlyChars = usernameParts[1]?.replace(/[0-9]/g, '');
      usernameParts2OnlyChars ? cleanUsername = usernameParts1OnlyChars.concat(usernameParts2OnlyChars) : cleanUsername = usernameParts1OnlyChars;
    } else {
      cleanUsername = username;
    }
    return cleanUsername;
  }

  buildCluster(identities: Identity[]) {
    let cluster = new Map<Identity, Identity[]>();
    identities.forEach(identity => {
      if (Array.from(cluster.keys()).find(key => this.identitiesAreSimilar(key, identity))) {
        cluster.get(Array.from(cluster.keys()).find(key => this.identitiesAreSimilar(key, identity))).push(identity)
      } else {
        cluster.set(identity, [identity]);
      }
    })
    return Array.from(cluster.values());
  }

  cleanName(name: string): string {
    name = name.replace(/[^a-zA-Z ]/g, '');
    return name.split(' ')[0].slice(0, 1).toUpperCase() + name.split(' ')[0].slice(1) + ' ' +
      name.split(' ')[1].slice(0, 1).toUpperCase() + name.split(' ')[1].slice(1);
  }

  identitiesAreEqual(firstIdentity: Identity, secondIdentity: Identity): boolean {
    return firstIdentity.firstName === secondIdentity.firstName &&
      firstIdentity.lastName === secondIdentity.lastName &&
      firstIdentity.email === secondIdentity.email &&
      firstIdentity.username === secondIdentity.username &&
      firstIdentity.source === secondIdentity.source;
  }

  getSourceDisplayIcon(source: string): string {
    switch (source) {
      case 'jira' :
        return 'assets/source/jira.png'
      case 'github':
        return 'assets/source/github.png'
      case 'bitbucket':
        return 'assets/source/bitbucket.png'
      case 'circle':
        return 'assets/source/circle.png'
      case 'gitlab':
        return 'assets/source/gitlab.png'
      case 'jenkins':
        return 'assets/source/jenkins.png'
      case 'pivotal':
        return 'assets/source/pivotal.png'
      case 'travis':
        return 'assets/source/travis.png'
      default:
        return 'assets/source/git.png'
    }
  }
}
