// Helpers Handlebars
class Helpers {
  static eq(a, b) {
    return a === b;
  }

  static sort(array, key) {
    // Vérifier que array est un tableau valide
    if (!Array.isArray(array)) {
      console.warn("Helper sort: argument n'est pas un tableau", array);
      return [];
    }

    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
  }

  static register(handlebarsInstance) {
    handlebarsInstance.registerHelper("eq", Helpers.eq);
    handlebarsInstance.registerHelper("sort", Helpers.sort);
  }
}

module.exports = Helpers;
