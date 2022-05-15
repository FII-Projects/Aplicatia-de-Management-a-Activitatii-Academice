export enum EndpointIdentifier {
    /** Check */
    CHECK = '/api/check',

    /** Visitor */
    SIGNUP_STUDENT = '/api/signup-student',

    LOGIN_STUDENT = '/api/login-student',
    LOGIN_STUDENT_CODE = '/api/login-student-code',
    LOGIN_ADMIN = '/api/login-admin',
    LOGIN_ADMIN_CODE = '/api/login-admin-code',
    LOGIN_COORDINATOR = '/api/login-coordinator',

    /** User */
    FORMS = `/api/forms`,
    INFORMATION = '/api/information',
    SCIENTIFIC_ARTICLE_ISI = '/api/sc-article-isi',
    ISI_PROCEEDINGS = '/api/isi-proceedings',
    SCIENTIFIC_ARTICLE_BDI = '/api/sc-article-bdi',
    SCIENTIFIC_BOOK = '/api/sc-book',
    TRANSLATION = '/api/translation',
    SCIENTIFIC_COMMUNICATION = '/api/sc-communication',
    PATENT = '/api/patent',
    RESEARCH_CONTRACT = '/api/research-contract',
    CITATION = '/api/citation',
    AWARD_AND_NOMINATION = '/api/award-nomination',
    ACADEMY_MEMBER = '/api/academy-member',
    EDITORIAL_MEMBER = '/api/editorial-member',
    ORGANIZED_EVENT = '/api/organized-event',
    WITHOUT_ACTIVITY = '/api/without-activity',
    DIDACTIC_ACTIVITY = '/api/didactic-activity',

    /** Admin */
    USER = '/api/user',
    BASE_INFORMATION = '/api/base-information',
    SEMESTER_ACTIVITY_EMAIL = '/api/semester-activity',
    EXPORT_FORMS = '/api/export-forms',
    FAZ = '/api/faz',
    VERBAL_PROCESS = '/api/verbal-process',
    THESIS_NOTIFICATION = '/api/thesis-notification',
    IMPORT_COORDINATORS = '/api/import-coordinators',
    COORDINATORS = '/api/coordinators',

    /* Coordinator */
    COORDINATOR_STUDENTS = '/api/coordinator/students',
    COORDINATOR_STUDENT_FORMS = '/api/coordinator/student-forms',

}