const guid = require('guid');

exports.getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};

exports.getPagingData = (data, page, limit) => {
    const { count: totalItemCount, rows: items } = data;
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItemCount / limit);

    return { totalItemCount, items, totalPages, currentPage };
};

exports.getNewFileName = (sourceFile) => {

    let fileExts = sourceFile.name.split(".");
    let fileExt = fileExts[fileExts.length - 1];

    return `${guid.create().value}.${fileExt}`;
}