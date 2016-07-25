import _ from 'lodash'
import { readMetainfo } from '../../sitebuilder/repo'

export function sitebuilderLocalsMiddleware() {
  return function *(next) {
    const sbMetainfo = yield readMetainfo('liberty-laser-eye-0')
    this.sbMetainfo = sbMetainfo

    const contentMenuItems = Object.keys(sbMetainfo)
      .map((key) => {
        return {
          key,
          metainfo: sbMetainfo[key].metainfo
        }
      })
      .filter((item) => !_.isEmpty(item.metainfo))

    this.jadeLocals = Object.assign({}, this.jadeLocals, {
      contentMenuItems
    });

    yield* next;
  }
}
