import BaseState from "@src/services/store/base";
import services from "@src/services";

class MetaState extends BaseState {

  defaultState() {
    return {
      data: {
        // rolesSelect: {
        //   where: 'inline',
        //   control: 'select',
        //   apiUrl: '/api/v1/roles',
        //
        // },

        ages: {
          where: 'page', // page, modal, panel, inline, ...
          control: 'universal-list',// universal-form, select-dropdown, ...

          title: 'Возраст',
          route: '/ages',
          api: '/api/v1/ages',
          params: {
            fields: 'items(*),count'
          },
          columns: {
            'id': {title: 'ID', field: 'id'},
            'value': {title: 'Age', field: 'value'}
          },
          example: {
            id: 0,
            value: 0
          },
          actionsMain: [
            {name: 'users'},
          ],
          actionsItem: [//@todo

          ]
        },
        odds: {
          title: 'Шансы',
          route: '/odds',
          api: '/api/v1/odds',
          params: {
            fields: 'items(*),count'
          },
          columns: {
            'age': {title: 'Age', field: 'age'},
            'female.prob': {title: 'Female probability', field: 'female.probability'},
            'female.number': {title: 'Female number', field: 'female.number'},
            'female.odds': {title: 'Female odds', field: 'female.odds'},
            'male.prob': {title: 'Male probability', field: 'male.probability'},
            'male.number': {title: 'Male number', field: 'male.number'},
            'male.odds': {title: 'Male odds', field: 'male.odds'},
          },
          example: {
            age: 1,
            female: {probability: 1, number: 0, odds: 0,},
            male: {probability: 1, number: 0, odds: 0,}
          }
        },
        progress: {
          title: 'Прогресс',
          route: '/progress',
          api: '/api/v1/progress',
          params: {
            fields: 'items(*),count'
          },
          columns: {
            'id': {title: 'ID', field: 'id'},
            'year': {title: 'Year', field: 'year'},
            'description': {title: 'Description', field: 'description'},
            'body': {title: 'Body', field: 'body'},
            'link': {title: 'Link', field: 'link', wrap: true},
          },
          example: {
            id: 0,
            year: 2021,
            description: '',
            body: '',
            link: ''
          }
        },
        hallmarks: {
          title: 'Показатели',
          route: '/hallmarks',
          api: '/api/v1/hallmarks',
          params: {
            fields: 'items(*),count'
          },
          columns: {
            'id': {title: 'ID', field: 'id'},
            'shortName': {title: 'Short Name', field: 'shortName'},
            'fullName': {title: 'Full Name', field: 'fullName'},
            'years': {title: 'Years', field: 'years'},
            'points': {title: 'Points', field: 'points'},
            'info': {title: 'Info', field: 'info'},
          },
          example: {
            id: 0, shortName: '', fullName: '', years: '', points: '', info: ''
          },
        },
        faces: {
          title: 'Лица',
          route: '/faces',
          api: '/api/v1/faces',
          params: {
            fields: 'items(*),count'
          },
          columns: {
            'fullUrl': {title: 'Full url', field: 'fullUrl'},
            'smallUrl': {title: 'Small url', field: 'smallUrl'},
            'status': {title: 'Status', field: 'status'},
            'failed': {title: 'Failed date', field: 'failed'},
            'views': {title: 'Views', field: 'views'},
            'tgMsgId': {title: 'tgMsgId', field: 'tgMsgId'},
          },
          example: {
            fullUrl: '',
            smallUrl: '',
            status: '',
            failed: new Date().toISOString(),
            views: 0,
            tgMsgId: ''
          },
        },
        medicines: {
          title: 'Медицина',
          route: '/medicines',
          api: '/api/v1/medicines',
          params: {
            fields: 'items(*),count'
          },
          columns: {
            // 'id': {title: 'ID', field: 'id'},
            'type': {title: 'Type', field: 'type'},
            'name': {title: 'Name', field: 'name'},
            'ageMin': {title: 'Age Min', field: 'ageMin'},
            'ageMax': {title: 'Age Max', field: 'ageMax'},
            'yearMin': {title: 'Year Min', field: 'yearMin'},
            'priceAvg': {title: 'Price Avg', field: 'priceAvg'},
            'yTimes': {title: 'YTimes', field: 'yTimes'},
            'isRequired': {title: 'Required', field: 'isRequired'},
            'risk': {title: 'risk', field: 'risk'},
            'description': {title: 'description', field: 'description'},
            'access1.price': {title: 'Access1 Price', field: 'access1.price'},
            'access1.desc': {title: 'Access1 Desc', field: 'access1.desc'},
            'access1.link': {title: 'Access1 Link', field: 'access1.link', wrap: true},
            'access2.price': {title: 'Access2 Price', field: 'access1.price'},
            'access2.desc': {title: 'Access2 Desc', field: 'access1.desc'},
            'access2.link': {title: 'Access2 Link', field: 'access1.link', wrap: true},
            'access3.price': {title: 'Access3 Price', field: 'access1.price'},
            'access3.desc': {title: 'Access3 Desc', field: 'access1.desc'},
            'access3.link': {title: 'Access3 Link', field: 'access1.link', wrap: true},
            'study1.desc': {title: 'Study1 Desc', field: 'study1.desc'},
            'study1.link': {title: 'Study1 Link', field: 'study1.link', wrap: true},
            'study2.desc': {title: 'Study2 Desc', field: 'study2.desc'},
            'study2.link': {title: 'Study2 Link', field: 'study2.link', wrap: true},
            'study3.desc': {title: 'Study3 Desc', field: 'study3.desc'},
            'study3.link': {title: 'Study3 Link', field: 'study3.link', wrap: true},
            'affiliate': {title: 'Affiliate', field: 'affiliate'},
          },
          example: {
            id: 0,
            type: 0,
            name: '',
            ageMin: 0,
            ageMax: 0,
            yearMin: 0,
            priceAvg: 0,
            yTimes: 0,
            isRequired: true,
            risk: 0,
            description: '',
            access1: {price: 0, desc: '', link: '',},
            access2: {price: 0, desc: '', link: '',},
            access3: {price: 0, desc: '', link: '',},
            study1: {desc: '', link: '',},
            study2: {desc: '', link: '',},
            study3: {desc: '', link: '',},
            affiliate: ''
          }
        },
        products: {
          where: 'page', // page, modal, panel, inline, ...
          control: 'universal-list',// universal-form, select-dropdown, ...

          title: 'Products',
          route: '/products',
          api: '/api/v1/products',
          params: {
            fields: 'items(*),count'
          },
          columns: {
            'id': {title: 'ID', field: 'id'},
            'title': {title: 'Title', field: 'title'},
            'body': {title: 'Text', field: 'bodyHtml'},
            'vendor': {title: 'Vendor', field: 'vendor'},
            'status': {title: 'Status', field: 'status'}
          },
          // example: {
          //   id: 0,
          //   title: '',
          //   body: '',
          //   vendor: '',
          //   status: ''
          // },
          actionsMain: [
            {name: 'products'},
          ],
          actionsItem: [//@todo
          ]
        },
        productOrders: {
          where: 'page', // page, modal, panel, inline, ...
          control: 'universal-list',// universal-form, select-dropdown, ...

          title: 'Product Orders',
          route: '/product-orders',
          api: '/api/v1/product-orders',
          params: {
            fields: 'items(product(*),*),count',
            sort: '-dateCreate'
          },
          columns: {
            'id': {title: 'ID', field: 'id'},
            'date': {title: 'Date', field: 'dateCreate'},
            'title': {title: 'Title', field: 'product.title'},
            'user': {title: 'User', field: 'user.email'},
          },
          // example: {
          //   id: 0,
          //   title: '',
          //   body: '',
          //   vendor: '',
          //   status: ''
          // },
          actionsMain: [
            {name: 'products'},
          ],
          actionsItem: [//@todo
          ]
        },
        users: {
          title: 'Users',
          route: '/users',
          api: '/api/v1/users',
          params: {
            fields: 'items(*, role(title)),count'
          },
          columns: {
            'email': {title: 'Email', field: 'email'},
            'username': {title: 'Username', field: 'username'},
            'role': {title: 'Role', field: 'role.title'},
            'profile.name': {title: 'Name', field: 'profile.name'},
            'profile.surname': {title: 'Surname', field: 'profile.surname'},
            'profile.middlename': {title: 'Middlename', field: 'profile.middlename'},
            //'profile.avatar': {title: 'Avatar', field: 'profile.avatar._id'},
            'profile.phone': {title: 'Phone', field: 'profile.phone'},
            'profile.birthday': {title: 'Birthday', field: 'profile.birthday'},
            'profile.age': {title: 'Age', field: 'profile.age'},
            'profile.ageChrono': {title: 'Age Chrono', field: 'profile.ageChrono'},
          },
          example: {
            email: '',
            username: '',
            role: {},
            profile: {
              name: '',
              surname: '',
              middlename: '',
              phone: '',
              birthday: '',
              age: 0,
              ageChrono: 0
            }
          }
        },
        files: {
          title: 'Файлы',
          route: '/files',
          api: '/api/v1/files',
          params: {
            fields: 'items(*),count'
          },
          columns: {
            'url': {title: 'Url', field: 'url'},
            'name': {title: 'Name', field: 'name'},
            'kind': {title: 'Kind', field: 'kind'},
            'originalName': {title: 'Original Name', field: 'originalName'},
          },
          example: {
            url: '',
            name: '',
            kind: '',
            originalName: ''
          }
        },


        // articles: {
        //   title: 'Товары',
        //   route: '/articles',
        //   api: '/api/v1/articles',
        //   params: {
        //     fields: 'items(*,maidIn),count'
        //   }
        // },
      },
      menu: {
        items: {
          longevity: {
            title: 'Longevity', kind: 'group', icon: 'DatabaseOutlined',
            items: {
              ages: {title: 'Возраст', url: '/ages'},
              odds: {title: 'Шансы', url: '/odds', icon: 'HeartOutlined'},
              progress: {title: 'Прогресс', url: '/progress', icon: 'FundOutlined'},
              hallmarks: {title: 'Показатели', url: '/hallmarks'},
              medicine: {title: 'Медицина', url: '/medicines'},
              faces: {title: 'Лица', url: '/faces'},

              products: {title: 'Products', url: '/products'},
              productOrders: {title: 'Product orders', url: '/product-orders'},
            }
          },
          system: {
            title: 'Система', kind: 'group', icon: 'SettingOutlined',
            items: {
              users: {title: 'Пользователи', url: '/users'},
              //files: {title: 'Файлы', url: '/files'},
              //articles: {title: 'Товар', url: '/articles'}
            }
          },
        }
      },
      wait: false,
      errors: null,
    };
  }

  async load() {
    //@todo Загрузка аннотации
  }

  /**
   * Изменение полей формы
   * @param data
   */
  change(data) {
    this.updateState({data}, 'Редактирование аннотации');
  }
}

export default MetaState;
