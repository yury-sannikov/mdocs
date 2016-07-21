
import Router from 'koa-router';
import _ from 'lodash';
import { Repo } from '../../sitebuilder';

const debug = require('debug')('app:routes:sitebuilder');

const router = new Router({
  prefix: '/sitebuilder'
});

router.get('main', '/', function*() {
  this.render('sitebuilder/main', Object.assign({}, this.jadeLocals, {
  }), true);
});

const pages = [
  {
    "title": "About",
    "permalink": "about",
    "header": "Laser Eye Surgery Specialist",
    "description": "Your eyes and vision are so important to you, that, although you’ve considered laser vision correction, you’ve been afraid to take a chance. Sound familiar? We hear this type of concern every day. That’s why Dr. Tanchel has continued to use the best and safest technology to treat her patients.",
    "htmlContent": "<p>Northern Virginia eye doctor Nancy A. Tanchel, M.D., the medical director of Liberty Laser Eye Center, is one of a select few full-time refractive LASIK surgeons in the country and she is one of the only women in the field. Dr. Tanchel was the first woman in the world to have the femtosecond laser in her Tysons Corner center. She earned degrees from Emory University and Johns Hopkins.</p><p>Dr. Tanchel has been dedicated to refractive eye surgery for many years and has performed more than 15,000 LASIK, All-Laser LASIK and PRK procedures – more than any other woman in America.</p><blockquote>''I have the best job in the world. I get to help people enjoy their lives more on a daily basis. Right after LASIK eye surgery I see smiles, then real joy the next day when my patients come in for their first post-op visit, seeing great. How wonderful is that?''</blockquote><p>As a Northern Virginia eye doctor specifically located in the town of Tysons Corner VA. Dr. Tanchel has dedicated her life to a helping those with vision problems. The combination of the most advanced laser eye equipment available and Dr. Nancy Tanchel’s years of LASIK eye surgery experience culminate into the best care a Northern Virginia or Washington DC patient could possibly ask for.</p><br><a href=''>Dr. Tanchel’s Curriculum Vitae</a><p>To find out if you’re a good candidate for LASIK eye surgery, contact our office at 571-234-5678 or use our online contact form.</p>"
  },
  {
    "title": "Random Page",
    "permalink": "page",
    "header": "Laser Eye Surgery Specialist",
    "description": "Your eyes and vision are so important to you, that, although you’ve considered laser vision correction, you’ve been afraid to take a chance. Sound familiar? We hear this type of concern every day. That’s why Dr. Tanchel has continued to use the best and safest technology to treat her patients.",
    "htmlContent": "<h2>All-Laser LASIK is the standard for accuracy and safety</h2><p>Your eyes and vision are so important to you, that, although you’ve considered laser vision correction, you’ve been afraid to take a chance. <h2>Intralase Femtosecond Laser</h2>Does this sound familiar? We hear this type of concern every day. That’s why Dr. Tanchel has continued to use the best and safest technology to treat her patients, and why she was very pleased to be the first in 2003 to acquire the Intralase femtosecond laser. She’s now first again with the next generation of femtosecond laser – the Ziemer Femto LDV, performing Z-LASIK.</p><p>She is the most experienced <a title='Washington DC LASIK cost | DC area LASIK | DC area LASIK eye surgery' href='http://www.libertylasereye.com/lasik-procedures/'>LASIK</a> surgeon in the Washington, DC metro region to utilize the femtosecond laser in her center.</p><h2>True Scientific Breakthrugh</h2><p>All-Laser LASIK is a true advance in vision correction surgery. The femtosecond laser eliminates the most serious risks associated with the LASIK procedure. It is an advance in accuracy and safety which should eliminate the fear many of us have when considering a procedure to eliminate the dependence on glasses and contact lenses.</p><p>Dr. Tanchel has been using the most advanced femtosecond lasers for over 10 years, and has the experience to get the most from the technology with unsurpassed results for our patients.</p>"
  }
];

router.get('pages', '/pages', function*() {
  const res = yield Repo.ensureWorkingDirectory();
  console.dir(res);
  this.render('sitebuilder/pages', Object.assign({}, this.jadeLocals, {
    pages
  }), true);
});

const pageSchema = {
  type: "object",
  title: "",
  properties: {
    title: {
      title: "Title",
      type: "string"
    },
    permalink: {
      title: "Permanent Link",
      type: "string",
      "format": "url"
    },
    header: {
      title: "Page Header",
      type: "string"
    },
    description: {
      title: "Page Description",
      type: "string"
    },
    htmlContent: {
      title: "Page Content",
      input_height:'200px',
      type: "string",
      "format": "html",
      "options": {
        "wysiwyg": true
      }
    }
  }
}

router.get('page', '/page/:id', function*() {
  const page = pages[this.params.id];
  const schema = Object.assign({}, pageSchema, {
    title: page.title
  });

  this.render('sitebuilder/page', Object.assign({}, this.jadeLocals, {
    page: JSON.stringify(page),
    schema: JSON.stringify(schema)
  }), true);
});

module.exports = router;
