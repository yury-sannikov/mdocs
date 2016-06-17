import fuzzy from 'clj-fuzzy';
import _ from 'lodash';

export function fuzzyMatch(source, suspect) {

  if (!_.isString(source) || !_.isString(suspect)) {
    return null;
  }

  if (_.isEmpty(source) || _.isEmpty(suspect)) {
    return null;
  }


  const metrics = fuzzy.metrics.jaro_winkler(source, suspect)
  const sourceMetaphones = source.split(' ').map( n => fuzzy.phonetics.metaphone(n));
  const suspectMetaphones = suspect.split(' ').map( n => fuzzy.phonetics.metaphone(n));
  const sourceLeft = sourceMetaphones.filter( m => _.indexOf(suspectMetaphones, m) === -1);

  const metaphoneIndex = ((sourceMetaphones.length - sourceLeft.length) / sourceMetaphones.length);

  return {
    metrics,
    metaphoneIndex,
    compositeIndex: (0.4 * metrics + 0.6 * metaphoneIndex)
  }
}
