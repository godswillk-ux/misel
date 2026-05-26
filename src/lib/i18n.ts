import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        shop: 'Shop Aesthetics',
        categories: 'Vibes',
        wishlist: 'Wishlist',
        dashboard: 'Dashboard',
        admin: 'Admin Panel',
        signIn: 'Sign In',
        signOut: 'Sign Out'
      },
      home: {
        heroTitle: 'MISEL: Redefine Your Style.',
        heroSubtitle: 'Minimalist decor and premium lifestyle pieces for those who value atmosphere.',
        shopNow: 'Shop Now',
        learnMore: 'Our Story',
        featuredProducts: 'New Arrivals',
        viewAll: 'View All'
      },
      products: {
        outOfStock: 'Out of Stock',
        addToCart: 'Add to Cart',
        reviews: 'Reviews',
        noReviews: 'No reviews yet.',
        addReview: 'Add Review',
        rating: 'Rating',
        comment: 'Comment',
        submit: 'Submit'
      },
      tracking: {
        title: 'Order Tracking',
        status: 'Status',
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        trackingNumber: 'Tracking Number',
        info: 'Shipping Information'
      }
    }
  },
  zh: {
    translation: {
      nav: {
        shop: '审美中心',
        categories: '氛围',
        wishlist: '愿望清单',
        dashboard: '仪表板',
        admin: '管理面板',
        signIn: '登录',
        signOut: '登出'
      },
      home: {
        heroTitle: 'MISEL: 重新定义您的风格',
        heroSubtitle: '为追求氛围的人士提供极简装饰和优质生活单品。',
        shopNow: '现在购买',
        learnMore: '我们的故事',
        featuredProducts: '新品上架',
        viewAll: '查看全部'
      },
      products: {
        outOfStock: '缺货',
        addToCart: '加入购物车',
        reviews: '评价',
        noReviews: '暂无评价。',
        addReview: '添加评价',
        rating: '评分',
        comment: '评论',
        submit: '提交'
      },
      tracking: {
        title: '订单追踪',
        status: '状态',
        pending: '待处理',
        processing: '处理中',
        shipped: '已发货',
        delivered: '已送达',
        trackingNumber: '运单号',
        info: '物流信息'
      }
    }
  },
  ja: {
    translation: {
      nav: {
        shop: 'エステティック',
        categories: 'バイブス',
        wishlist: 'ウィッシュリスト',
        dashboard: 'ダッシュボード',
        admin: '管理パネル',
        signIn: 'サインイン',
        signOut: 'サインアウト'
      },
      home: {
        heroTitle: 'MISEL: あなたのスタイルを再定義する',
        heroSubtitle: '雰囲気を重んじる人々のための、ミニマリストな装飾とプレミアムなライフスタイルアイテム。',
        shopNow: '今すぐ購入',
        learnMore: '私たちの物語',
        featuredProducts: '新着商品',
        viewAll: 'すべて見る'
      },
      products: {
        outOfStock: '在庫切れ',
        addToCart: 'カートに入れる',
        reviews: 'レビュー',
        noReviews: 'レビューはまだありません。',
        addReview: 'レビューを追加',
        rating: '評価',
        comment: 'コメント',
        submit: '送信'
      },
      tracking: {
        title: '注文追跡',
        status: 'ステータス',
        pending: '保留中',
        processing: '処理中',
        shipped: '出荷済み',
        delivered: '配達済み',
        trackingNumber: '追跡番号',
        info: '配送情報'
      }
    }
  },
  fr: {
    translation: {
      nav: {
        shop: 'Boutique Esthétique',
        categories: 'Vibrations',
        wishlist: 'Liste de souhaits',
        dashboard: 'Tableau de bord',
        admin: 'Administration',
        signIn: 'Connexion',
        signOut: 'Déconnexion'
      },
      home: {
        heroTitle: 'MISEL : Redéfinissez votre style',
        heroSubtitle: 'Décor minimaliste et pièces de style de vie haut de gamme pour ceux qui apprécient l\'atmosphère.',
        shopNow: 'Acheter maintenant',
        learnMore: 'Notre histoire',
        featuredProducts: 'Nouveautés',
        viewAll: 'Voir tout'
      },
      products: {
        outOfStock: 'En rupture de stock',
        addToCart: 'Ajouter au panier',
        reviews: 'Avis',
        noReviews: 'Aucun avis pour le moment.',
        addReview: 'Ajouter un avis',
        rating: 'Note',
        comment: 'Commentaire',
        submit: 'Envoyer'
      },
      tracking: {
        title: 'Suivi de commande',
        status: 'Statut',
        pending: 'En attente',
        processing: 'En traitement',
        shipped: 'Expédié',
        delivered: 'Livré',
        trackingNumber: 'Numéro de suivi',
        info: 'Informations de livraison'
      }
    }
  },
  de: {
    translation: {
      nav: {
        shop: 'Ästhetik-Shop',
        categories: 'Vibes',
        wishlist: 'Wunschliste',
        dashboard: 'Dashboard',
        admin: 'Admin-Bereich',
        signIn: 'Anmelden',
        signOut: 'Abmelden'
      },
      home: {
        heroTitle: 'MISEL: Definieren Sie Ihren Stil neu',
        heroSubtitle: 'Minimalistisches Dekor und hochwertige Lifestyle-Stücke für alle, die Atmosphäre schätzen.',
        shopNow: 'Jetzt shoppen',
        learnMore: 'Unsere Geschichte',
        featuredProducts: 'Neuheiten',
        viewAll: 'Alle ansehen'
      },
      products: {
        outOfStock: 'Ausverkauft',
        addToCart: 'In den Warenkorb',
        reviews: 'Bewertungen',
        noReviews: 'Noch keine Bewertungen.',
        addReview: 'Bewertung hinzufügen',
        rating: 'Bewertung',
        comment: 'Kommentar',
        submit: 'Absenden'
      },
      tracking: {
        title: 'Sendungsverfolgung',
        status: 'Status',
        pending: 'Ausstehend',
        processing: 'In Bearbeitung',
        shipped: 'Versandt',
        delivered: 'Geliefert',
        trackingNumber: 'Sendungsnummer',
        info: 'Versandinformationen'
      }
    }
  },
  es: {
    translation: {
      nav: {
        shop: 'Tienda de Estética',
        categories: 'Vibras',
        wishlist: 'Lista de Deseos',
        dashboard: 'Panel',
        admin: 'Administración',
        signIn: 'Iniciar Sesión',
        signOut: 'Cerrar Sesión'
      },
      home: {
        heroTitle: 'MISEL: Redefine tu Estilo.',
        heroSubtitle: 'Decoración minimalista y piezas de estilo de vida premium para quienes valoran la atmósfera.',
        shopNow: 'Comprar Ahora',
        learnMore: 'Nuestra Historia',
        featuredProducts: 'Novedades',
        viewAll: 'Ver Todo'
      },
      products: {
        outOfStock: 'Agotado',
        addToCart: 'Añadir al Carrito',
        reviews: 'Reseñas',
        noReviews: 'Aún no hay reseñas.',
        addReview: 'Añadir Reseña',
        rating: 'Calificación',
        comment: 'Comentario',
        submit: 'Enviar'
      },
      tracking: {
        title: 'Seguimiento de Pedidos',
        status: 'Estado',
        pending: 'Pendiente',
        processing: 'Procesando',
        shipped: 'Enviado',
        delivered: 'Entregado',
        trackingNumber: 'Número de seguimiento',
        info: 'Información de Envío'
      }
    }
  },
  it: {
    translation: {
      nav: {
        shop: 'Estetica Shop',
        categories: 'Vibrazioni',
        wishlist: 'Preferiti',
        dashboard: 'Dashboard',
        admin: 'Amministrazione',
        signIn: 'Accedi',
        signOut: 'Esci'
      },
      home: {
        heroTitle: 'MISEL: Ridefinisci il tuo Stile.',
        heroSubtitle: 'Arredi minimalisti e articoli di lifestyle premium per chi apprezza l\'atmosfera.',
        shopNow: 'Acquista Ora',
        learnMore: 'La Nostra Storia',
        featuredProducts: 'Nuovi Arrivi',
        viewAll: 'Vedi Tutto'
      },
      products: {
        outOfStock: 'Esaurito',
        addToCart: 'Aggiungi al Carrello',
        reviews: 'Recensioni',
        noReviews: 'Ancora nessuna recensione.',
        addReview: 'Aggiungi Recensione',
        rating: 'Valutazione',
        comment: 'Commento',
        submit: 'Invia'
      },
      tracking: {
        title: 'Tracciamento Ordine',
        status: 'Stato',
        pending: 'In Attesa',
        processing: 'In Elaborazione',
        shipped: 'Spedito',
        delivered: 'Consegnato',
        trackingNumber: 'Numero di Tracking',
        info: 'Informazioni di Spedizione'
      }
    }
  },
  pt: {
    translation: {
      nav: {
        shop: 'Loja de Estética',
        categories: 'Vibrações',
        wishlist: 'Favoritos',
        dashboard: 'Dashboard',
        admin: 'Painel Admin',
        signIn: 'Entrar',
        signOut: 'Sair'
      },
      home: {
        heroTitle: 'MISEL: Redefina seu Estilo.',
        heroSubtitle: 'Decoração minimalista e peças de estilo de vida premium para quem valoriza a atmosfera.',
        shopNow: 'Comprar Agora',
        learnMore: 'Nossa História',
        featuredProducts: 'Novidades',
        viewAll: 'Ver Tudo'
      },
      products: {
        outOfStock: 'Esgotado',
        addToCart: 'Adicionar ao Carrinho',
        reviews: 'Avaliações',
        noReviews: 'Ainda não há avaliações.',
        addReview: 'Adicionar Avaliação',
        rating: 'Classificação',
        comment: 'Comentário',
        submit: 'Enviar'
      },
      tracking: {
        title: 'Rastreamento de Pedido',
        status: 'Status',
        pending: 'Pendente',
        processing: 'Processando',
        shipped: 'Enviado',
        delivered: 'Entregue',
        trackingNumber: 'Número de Rastreio',
        info: 'Informações de Envio'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
