import {
  ADMIN_BAI_FILE_UPLOADS_CTRL,
  ADMIN_KTH_FILE_UPLOADS_CTRL,
  API_ENDPOINT,
  COVER_ENDPOINT,
  DELIVERY_FILE_UPLOADS_CTRL,
  FILE_UPLOADS_CTRL,
  FILES_EXEMPLES_BAI_ENDPOINT,
  SINGLE_DELIVERY_ENDPOINT,
  USER_AVATAR_ENDPOINT,
  USER_PRESENTATION_VIDEO_ENDPOINT,
  WEBINAR_VIDEO_ENDPOINT,
} from "../../server/src/provider/routes.helper";

export const BASE_API_UPLOADS = `/${API_ENDPOINT}/${FILE_UPLOADS_CTRL}/`;
export const ACCOUNT_PAGE_AVATAR_UPLOAD =
  BASE_API_UPLOADS + USER_AVATAR_ENDPOINT;
export const ACCOUNT_PAGE_PRESENTATION_VIDEO_UPLOAD =
  BASE_API_UPLOADS + USER_PRESENTATION_VIDEO_ENDPOINT;
export const COMPANY_PAGE_LOGO_UPLOAD = BASE_API_UPLOADS + "company/logo/";
export const ANSWER_IMG_UPLOAD = BASE_API_UPLOADS + "proposition/img/";
export const QUESTION_IMG_UPLOAD = BASE_API_UPLOADS + "question/img/";
export const THEME_LOGO_1_UPLOAD = BASE_API_UPLOADS + "theme/logo/1/";
export const THEME_LOGO_2_UPLOAD = BASE_API_UPLOADS + "theme/logo/2/";
export const THEME_LOGO_3_UPLOAD = BASE_API_UPLOADS + "theme/logo/3/";

// webinar
export const WEBINAR_VIDEO_UPLOAD = BASE_API_UPLOADS + WEBINAR_VIDEO_ENDPOINT;

// admin kth
export const ADMIN_KTH_UPLOADS_API = `/${API_ENDPOINT}/${ADMIN_KTH_FILE_UPLOADS_CTRL}/`;
export const KTH_BANNER_IMG_UPLOAD = ADMIN_KTH_UPLOADS_API + "banner";
export const KTH_PROGRAM_IMG_UPLOAD = ADMIN_KTH_UPLOADS_API + "program";

// bai
export const ADMIN_BAI_UPLOADS_API = `/${API_ENDPOINT}/${ADMIN_BAI_FILE_UPLOADS_CTRL}/`;
export const KTH_BAI_COVER_IMG_UPLOAD = ADMIN_BAI_UPLOADS_API + COVER_ENDPOINT;
export const KTH_BAI_FILES_EXEMPLES_UPLOAD =
  ADMIN_BAI_UPLOADS_API + FILES_EXEMPLES_BAI_ENDPOINT;

// delivery
export const DELIVERY_UPLOAD_API = `/${API_ENDPOINT}/${DELIVERY_FILE_UPLOADS_CTRL}/`;
export const SINGLE_DELIVERY_FILE_UPLOAD =
  DELIVERY_UPLOAD_API + SINGLE_DELIVERY_ENDPOINT;
