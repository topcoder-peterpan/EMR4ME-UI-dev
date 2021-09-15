import { i18n } from "../util";
import images from "./images";

export default {
    MAX_PHONE_CELLS_LENGTH:5,
    MAX_MAIL_CELLS_LENGTH:5,
    raceList: [
        {
            value: i18n.t('health.main.nonHispanicWhite'),
        },
        {
            value: i18n.t('health.main.hispanic'),
        },
        {
            value: i18n.t('health.main.black'),
        },
        {
            value: i18n.t('health.main.asian'),
        },
        {
            value: i18n.t('health.main.pacificIslander'),
        },
        {
            value: i18n.t('health.main.americanIndian'),
        },
        {
            value: i18n.t('health.main.americanNative'),
        },
        {
            value: i18n.t('health.main.other'),
        },
    ],
    gender: [
        { value: i18n.t('health.asthma.male'), key: 'male' },
        { value: i18n.t('health.asthma.female'), key: 'female' }
    ],
    maritalStatus: [
        { value: i18n.t('user.single'), key: 'single' },
        { value: i18n.t('user.married'), key: 'married' },
        { value: i18n.t('user.divorced'), key: 'divorced' },
        { value: i18n.t('user.widow'), key: 'widowed' }
    ],
    ethnicGroups: [
        { value: 'Hispanic', key: 'Hispanic' },
        { key: 'African Americans', value: 'African Americans' },
        { key: 'Caucasia', value: 'Caucasia' },
        { key: 'Asian', value: 'Asian' },
        { key: 'Native Americans', value: 'Native Americans' },
        { key: 'Native Alaskan', value: 'Native Alaskan' },
        { key: 'Native Hawaiian', value: 'Native Hawaiian' },
        { key: 'Pacific Islander', value: 'Pacific Islander' },
        { key: 'North African Middle Eastern', value: 'North African Middle Eastern' },
    ]
    ,
    educationList: [
        {
            value: i18n.t('health.stroke.secondary'),
        },
        {
            value: i18n.t('health.stroke.secondaryDiploma'),
        },
        {
            value: i18n.t('health.stroke.postsecondaryDiploma'),
        },
    ],
    monthShortNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    myDoctors: [
        {
          id: 1,
          name: 'Abdalla Sokkar',
          photo: images.doc1,
        },
        {
          id: 2,
          name: 'Ahmed Atef',
          photo: images.doc2,
        },
        {
          id: 3,
          name: 'Hesham Abdelnaby',
          photo: images.doc3,
        },
        {
          id: 4,
          name: 'Mohamed Maher',
          photo: images.doc1,
        },
        {
          id: 5,
          name: 'Mostafa Hamed',
          photo: images.doc2,
        },
        {
          id: 6,
          name: 'Zahraa Gamal',
          photo: images.doc3,
        },
        {
          id: 7,
          name: 'Yassmine Elkhawas',
          photo: images.doc2,
        },
        {
            id: 8,
            name: 'Zebeda Mahmoud',
            photo: images.doc1,
          },
          {
            id: 9,
            name: 'Ziyad Sabry',
            photo: images.doc2,
          }
          
      ]
}