'use strict';

exports.index = (req, res) => {
  res.render('map', {
    title: 'Interactive Map'
  });
};
