import config from '../config'
import bluebird from 'bluebird'
//import NodeGit from 'nodegit'
import path from 'path'

const SECRET_KEY = './resources/codecommit/codecommit'
const PUB_KEY = './resources/codecommit/codecommit.pub'

/**
  Prepare working directory
  Pull latest if existing code base stale
  Check for temporary branch
*/
export function ensureWorkingDirectory() {
  // const repoId = 'liberty-laser-eye-0'
  // const local = path.join(config.SITEBUILDER_DIR, repoId)
  // const url = `ssh://APKAIWCZJMDPFTK5UOOQ@git-codecommit.us-east-1.amazonaws.com/v1/repos/${repoId}`
  // const opts = {
  //   ssh: {
  //       publicKey: PUB_KEY,
  //       privateKey: SECRET_KEY
  //   },
  //   ignoreCertErrors: 1,
  //   ignore_cert_errors: 1,
  //   fetchOpts: {
  //     callbacks: {
  //       certificateCheck: function() { return 1; },
  //       credentials: function(url, userName) {
  //         console.log(userName);
  //         console.log(url);
  //         return NodeGit.Cred.sshKeyNew(
  //         config.SITEBUILDER_CC_USER,
  //         PUB_KEY,
  //         SECRET_KEY,
  //         "");
  //       },
  //       transferProgress: function(info) {
  //         return console.dir(info);
  //       }
  //     }
  //   }
  // };
  // console.log(`Cloning from ${url}`)
  // return NodeGit.Clone.clone(url, local, opts)
}
