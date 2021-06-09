// This is an example file. Please replace the below with the actual entities file and then remove this comment

// Different types of role objects

module.exports = [

    {
        name: "Site Sudo Admin",
        org_id: 14,
        type: 'iam_role',
        entity_name: '*',
        roles: [
            ['*', '*', '0'],
        ],
        other_data: {}
    },


    {
        name: "Only Access To Strips",
        org_id: 14,
        type: 'iam_role',
        entity_name: 'atc.strips',
        roles: [
            // entityName, role, id_slug
            ['at.strips', 'w', 'id'],
        ],
        other_data: {}
    },

    // The entities of the system, the below one is an example only.
    {
        name: "Strips",
        org_id: 14,
        type: 'db_entity',
        entity_name: 'atc.strips',
        roles: [
            ['atc.pond', '*', 'id'],
            ['atc.atc', 'l', 'atc_id']
        ],
        other_data: {}
    },

    {
        name: "Group",
        org_id: 14,
        type: 'db_entity',
        entity_name: 'public.groups',
        roles: [
            ['public.group', '*', 'id'],
        ],
        other_data: {}
    },

]
