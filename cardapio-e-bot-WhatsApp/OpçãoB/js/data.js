const STORE_DATA = {
    
    config: {
        storeName: "Loja de teste",
        whatsappNumber: "5519971286931",
        address: "Seu Endereço Fixo Aqui",
        primaryColor: "#A90E0E",
        secondaryColor: "#FF7F0A",
        bannerImage: "uploads/default.png",
        hours: {
            seg: "Fechado",
            ter: "18h às 23h",
            qua: "18h às 23h",
            qui: "18h às 23h",
            sex: "18h às 00h",
            sab: "18h às 00h",
            dom: "Fechado"
        }
    },

    categories: [
        { id: 1, name: "Lanches" },
        { id: 2, name: "Bebidas" },
        { id: 3, name: "Porções" }
    ],

    products: [
        {
            id: 101,
            name: "X-Burger Clássico",
            description: "Pão, hambúrguer, queijo e salada.",
            price: 18.00,
            image: "uploads/default.png",
            category_id: 1,
            is_on_promotion: false,
            promotion_price: null
        },
        {
            id: 102,
            name: "X-Bacon Especial",
            description: "O dobro de bacon e molho da casa.",
            price: 25.00,
            image: "uploads/default.png",
            category_id: 1,
            is_on_promotion: true,
            promotion_price: 21.90
        },
        {
            id: 201,
            name: "Coca-Cola Lata",
            description: "350ml, gelada.",
            price: 6.00,
            image: "uploads/default.png",
            category_id: 2,
            is_on_promotion: false,
            promotion_price: null
        }

    ]
};