import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

// import { Chartist } from 'meteor/mfpierre:chartist-js';
// import 'meteor/mspi:chartistlegend';

import { Films } from '../imports/api/films/films.js';

if (Meteor.isClient) {
  Template.showFilm.helpers({
    linklist() {
      const printLinks = [];
      const links = ['facebook', 'twitter', 'youtube', 'instagram'];
      const film = this;

      _.each(links, (elem) => {
        if (film[elem]) {
          printLinks.push({
            name: elem,
            link: film[elem],
          });
        }
      });

      return printLinks;
    },
    is_only_portfolio(film) {
      if (!film) { film = this; }
      return (film.status === 'Portfolio');
    },
    is_portfolio(film) {
      if (!film) { film = this; }
      return (film.status === 'Portfolio' || film.status === 'Difusão/Portfolio');
    },
    is_difusao(film) {
      if (!film) { film = this; }
      return (film.status === 'Difusão' || film.status === 'Difusão/Portfolio');
    },
    is_difusao_portfolio(film) {
      if (!film) { film = this; }
      return (film.status === 'Difusão/Portfolio');
    },
    is_oculto(film) {
      if (!film) { film = this; }
      return film.status === 'Oculto';
    },
    hideIfNotDifusaoPortfolio(film) {
      if (!film) { film = this; }
      if (film.status === 'Difusão/Portfolio') {
        return '';
      }
      return 'hide';
    },
    inventory() {
      return Films.inventory(this);
    },
    tibr() {
      if (!this.technical_information) return;

      this.technical_information.replace(/\n/g, '<br />');
    },
    has_categories(categories) {
      return !_.isEmpty(categories);
    },
  });

  Template.showFilm.onRendered(() => {
    $('#carousel').slick({
      arrows: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 6000,
    });
    $("a[rel^='prettyPhoto']").prettyPhoto();

    if (this.data && this.data.status.includes('Portfolio')) {
      const inventory = Films.inventory(this.data);

      if (!inventory) return;
      if (inventory.viewers_zones) {
        const labels = [];
        _.keys(inventory.viewers_zones).forEach((k) => {
          labels.push(`${k} ( ${inventory.viewers_zones[k]} )`);
        });
        new Chartist.Pie('#zone-chart', {
          labels, // _.keys(inventory.viewers_zones),
          series: _.values(inventory.viewers_zones),
        }, {
          width: 200,
          donut: true,
          donutWidth: 46,
          showLabel: false,
          plugins: [
            Chartist.plugins.legend(),
          ],
        });
      }

      if (inventory.viewers_per_month) {
        const series = _.values(inventory.viewers_per_month).slice(0, 4);
        new Chartist.Line('#viewers-chart', {
          labels: [
            `<center>Primeiro Mês<br>(${series[0]})`,
            `<center>Segundo Mês<br>(${series[1]})`,
            `<center>Terceiro Mês<br>(${series[2]})`,
            `<center>Quarto Mês<br>(${series[3]})`,
          ],
          series: [series],
        }, {
          height: 200,
          chartPadding: {
            right: 40,
          },
        });
      }

      if (inventory.categories) {
        const labels = [];
        _.keys(inventory.categories).forEach((k) => {
          labels.push(
            `${k} (${inventory.categories[k]})`
          );
        });
        new Chartist.Pie('#institution-type-chart', {
          labels, // _.keys(inventory.categories),
          series: _.values(inventory.categories),
        }, {
          width: 200,
          donut: true,
          donutWidth: 46,
          showLabel: false,
          plugins: [
            Chartist.plugins.legend(),
          ],
        });
      }

      if (inventory.subcategories) {
        labels = [];
        _.keys(inventory.subcategories).forEach((k) => {
          labels.push(
            `${k} (${inventory.subcategories[k]})`
          );
        });
        new Chartist.Pie('#institution-area-chart', {
          labels, // _.keys(inventory.subcategories),
          series: _.values(inventory.subcategories),
        }, {
          width: 200,
          donut: true,
          donutWidth: 46,
          showLabel: false,
          plugins: [
            Chartist.plugins.legend(),
          ],
        });
      }
    }
  });
}
