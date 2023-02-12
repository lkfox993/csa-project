const { schemaComposer } = require('graphql-compose');
const { AcademyTC } = require('../db/schemas/academy');
const { CategoryTC } = require('../db/schemas/category');

schemaComposer.Query.addFields({

    academyPagination: AcademyTC.getResolver('pagination'),
    academyMany: AcademyTC.getResolver('findMany'),
    academyById: AcademyTC.getResolver('findById'),

    categoryPagination: CategoryTC.getResolver('pagination'),
    categoryMany: CategoryTC.getResolver('findMany'),
    categoryById: CategoryTC.getResolver('findById'),

});

schemaComposer.Mutation.addFields({

    academyCreateOne: AcademyTC.getResolver('createOne'),
    academyRemoveById: AcademyTC.getResolver('removeById'),
    academyUpdateById: AcademyTC.getResolver('updateById'),

    categoryCreateOne: CategoryTC.getResolver('createOne'),
    categoryRemoveById: CategoryTC.getResolver('removeById'),

});