// Different types of role objects

let objs = [

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
        name: "Farm User",
        org_id: 14,
        type: 'iam_role',
        entity_name: 'farm.farms',
        roles: [
            ['farm.farm', 'r', 'id'],
            ['farm.farm', 'w', 'id']
        ],
        other_data: {}
    },
    
    {
        name: 'Pond Analyst',
        org_id: 14,
        type: 'iam_role',
        entity_name: 'farm.ponds',
        roles: [
            ['farm.pond', 'r', 'id'],
            ['farm.farms', 'l', 'farm_id']
        ],
        other_data: {}
    },
    
    {
        name: "Ponds",
        org_id: 14,
        type: 'db_entity',
        entity_name: 'farm.ponds',
        roles: [
            ['farm.pond', '*', 'id'],
            ['farm.farm', 'l', 'farm_id']
        ],
        other_data: {}
    }
]
