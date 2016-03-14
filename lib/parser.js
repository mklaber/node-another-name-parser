"use strict";

var util = require('./util');

var suffixes = [
  'CCSP', 'CPA', 'DC', 'DDS', 'DMD', 'DO', 'DPM', 'DVM', 'ESQ', 'ESTATE',
  'FAM', 'FAMILY', 'II', 'III', 'IV', 'JR', 'LUTCF', 'MD', 'OC', 'OD', 'PA',
  'PE', 'PHD', 'SJ', 'SR', 'V', 'VI', 'VP', 'V', 'I', 'VI', 'VII', 'VIII',
  'CNP', 'CPA', 'DDS', 'DMin', 'DMA ', 'DMus', 'OD', 'DO', 'PharmD', 'PhD',
  'PsyD', 'DVM', 'EI', 'EIT', 'Esq', 'JD', 'LLS', 'LP', 'LPN',
  'MD', 'PE', 'RA', 'RLA', 'RLS', 'RN', 'SE'
];

var prefixes = [
  'AB', 'AIRMAN', 'AN', 'AND', 'BG', 'BR', 'BRIG', 'BRIGADIER', 'CADET',
  'CAPT', 'CAPTAIN', 'CMDR', 'COL', 'COLONEL', 'COMMISSIONER', 'COMMANDER',
  'CORPORAL', 'CPL', 'CPT', 'DEP', 'DEPUTY', 'DOCTOR', 'DR', 'FATHER', 'FR',
  'GEN', 'GENERAL', 'HON', 'HONORABLE', 'JDGE', 'JUDGE', 'LIEUTENANT', 'LT',
  'LTCOL', 'LTGEN', 'MAJ', 'MAJGEN', 'MAJOR', 'MASTER', 'MISS', 'MISTER',
  'MR', 'MRMRS', 'MRS', 'MS', 'PASTOR', 'PFC', 'PRES', 'PRIVATE', 'PROF',
  'PROFESSOR', 'PVT', 'RABBI', 'REP', 'REPRESENTATIVE', 'REV', 'REVEREND',
  'SEN', 'SENATOR', 'SGT', 'SSGT', 'SHERIFF', 'SIR', 'SISTER', 'SM', 'SN',
  'SRA', 'SSGT'
];

// based off of frequency > 1000 in US base file
var compoundFirstNames = [
  'ANA MARIA', 'ANN MARIE', 'ANNA MARIA', 'ANNA MARIE', 'ANNE MARIE',
  'BARBARA ANN', 'BETH ANN', 'BETTY ANN', 'BETTY JEAN', 'BETTY JO',
  'BILLIE JO', 'CAROL ANN', 'JO ANN', 'JO ANNA', 'JO ANNE', 'JO ELLEN',
  'JOHN PAUL', 'JOSE LUIS', 'JUAN CARLOS', 'JULIE ANN', 'LA DONNA', 'LA TOYA',
  'LA VERNE', 'LE ROY', 'LEE ANN', 'LEIGH ANN', 'LISA MARIE', 'LORI ANN',
  'LOU ANN', 'LU ANN', 'MARIA DE', 'MARIA DEL', 'MARIA ELENA', 'MARIA TERESA',
  'MARY ALICE', 'MARY ANN', 'MARY ANNE', 'MARY BETH', 'MARY ELIZABETH',
  'MARY ELLEN', 'MARY FRANCES', 'MARY GRACE', 'MARY JANE', 'MARY JEAN',
  'MARY JO', 'MARY KAY', 'MARY LEE', 'MARY LOU', 'MARY LOUISE', 'MARY LYNN',
  'PATRICIA ANN', 'ROSE ANN', 'ROSE MARIE', 'ROSE MARY', 'RUTH ANN',
  'SAN JUANA', 'SAN JUANITA', 'SUE ANN', 'WILLIE MAE'
];

var compoundLastNamePrefixes = [
  'AL', 'BIN', 'DA', 'DE', 'DEL', 'DELLA', 'DI', 'DU', 'EL', 'IBN', 'LA',
  'LE', 'LO', 'MAC', 'MC', 'PIETRO', 'ST', 'TER', 'VAN', 'VANDEN',
  'VERE', 'VON'
];

var isSuffix = function(s) {
  return util.contains(suffixes, s.replace(/\./g, ''));
};

var isPrefix = function(s) {
  return util.contains(prefixes, s.replace(/\./g, ''));
};

var isCompoundFirstName = function(s1, s2) {
  return util.contains(compoundFirstNames, s1 + ' ' + s2);
};

var isCompoundLastNamePrefix = function(s) {
  return util.contains(compoundLastNamePrefixes, s.replace(/\./g, ''));
};

var parser = function(name) {
  var originalName = name;
  var parsedName = {
    prefix: null,
    first: null,
    middle: null,
    last: null,
    suffix: null,
    original: originalName
  };
  if (util.isBlank(name)) {
    return parsedName;
  }


  // Ugh, probably shouldn't be stripping double quotes in the cleaner

  // strip out James (Jim) Gordon
  name = name.replace(/\s*\(.+\)\s*/g, ' ');
  // strip out James "Jim" Gordon
  name = name.replace(/\s*".+"\s*/g, ' ');

  // collapse whitespace
  name = util.collapseWhitespace(name);





  // TODO: may not want to limit this to "1" (though it makes splitting weird)
  if (util.count(name, ',') === 1) {
    var commaTokens = name.split(',');
    var tokenAfterComma = commaTokens[1].trim();
    // check if the name ends with a suffix (ignore the '.' in Ph.D., Jr. etc.)
    if (isSuffix(tokenAfterComma)) {
      // assume it's Jim Gordon, Esq.
      parsedName.suffix = tokenAfterComma;
      name = commaTokens[0].trim();
    } else {
      // assume it's Gordon, Jim
      // reverse it
      name = commaTokens[1].trim() + ' ' + commaTokens[0].trim();
    }
  }

  var tokens = name.split(/\s+/),
    totalTokens = tokens.length,
    loop = 0,
    token;

  while(loop < totalTokens) {

    token = tokens[loop];

    if (isPrefix(token)) {
      parsedName.prefix = util.isBlank(parsedName.prefix) ?
        token : parsedName.prefix + ' ' + token;
      // null it out because we've taken care of it
      tokens[loop] = null;
    } else if (isSuffix(token)) {
      parsedName.suffix = util.isBlank(parsedName.suffix) ?
        token : parsedName.suffix + ' ' + token;
      // null it out because we've taken care of it
      tokens[loop] = null;
    }

    loop++;

  }

  tokens = util.compact(tokens), // clear out the nulls induced above
    totalTokens = tokens.length,
    loop = 0;

  var hasCompoundFirst = false,
    hasCompoundLast = false;

  // if we only have "Mary Ann", this will split Mary --> First, Ann --> Last
  hasCompoundFirst = totalTokens > 2 && isCompoundFirstName(tokens[0], tokens[1]);
  hasCompoundLast = totalTokens > 2 && isCompoundLastNamePrefix(tokens[totalTokens - 2]);


  while(loop < totalTokens) {

    token = tokens[loop];

    if (loop === 0 || (loop === 1 && hasCompoundFirst)) {
      parsedName.first = loop === 0 ? token : parsedName.first + ' ' + token;
    } else if (hasCompoundLast && (loop === (totalTokens - 1) || loop === (totalTokens - 2))) {
      // has a compound last and we're on the last 2 tokens
      parsedName.last = loop + 2 === totalTokens ?
        token : parsedName.last + ' ' + token;
    } else if (loop === 1 || (loop === 2 && hasCompoundFirst)) {
      // we're on the 2nd word; or the 3rd word but the 1st 2 are compound
      if (totalTokens >= 3 && !hasCompoundFirst && !isCompoundLastNamePrefix(token)) {
        // we're on the second word of a three or more word name
        // and the first two weren't a compound
        parsedName.middle = token;
      } else if(totalTokens >= 4 && hasCompoundFirst) {
        // we're on the third word of a four or more word name
        // and the first two were compound
        parsedName.middle = token;
      } else {
        // we're on the second word of a two word name
        parsedName.last = token;
      }
    } else { //if ( loop > 1) {
      // we're on the 3rd word of a 3 or more name
      parsedName.last = util.isBlank(parsedName.last) ?
        token : parsedName.last + ' ' + token;
    }

    loop++;
  }

  return parsedName;
};

module.exports = parser;
