/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import AppConstants from '../../app-constants.js'
import { getMessage } from '../../utils/fluent.js'

const companyAddress = '2 Harrison St. #175, San Francisco, California 94105 USA'
const links = (data) => ({
  faq: 'https://support.mozilla.org/kb/firefox-monitor-faq',
  hibp: 'https://haveibeenpwned.com/',
  legal: `https://www.mozilla.org/about/legal?utm_source=fx-monitor&utm_medium=email&utm_campaign=${data.utmCampaign}&utm_content=email-footer-link`,
  termsAndPrivacy: `https://www.mozilla.org/privacy/firefox-monitor?utm_source=fx-monitor&utm_medium=email&utm_campaign=${data.utmCampaign}&utm_content=email-footer-link`
})

const images = {
  header: `${AppConstants.SERVER_URL}/images/email/person-at-desk.png`,
  footer: `${AppConstants.SERVER_URL}/images/email/mozilla-logo-bw.png`,
  logoDark: `${AppConstants.SERVER_URL}/images/email/monitor-logo-transparent-dark-mode.png`,
  logoLight: `${AppConstants.SERVER_URL}/images/email/monitor-logo-bg-light.png`
}

const bodyStyle = `
  color: black;
  font: normal 16px/1.2 sans-serif;
`

const tableStyle = `
  margin: auto;
  max-width: 1080px;
  text-align: center;
  width: 100%;
`

const headerTableStyle = `
  background-color: #321c64;
  color: white;
  height: 331px;
  text-align: left;
  width: 100%;
`

const headerImageContainerStyle = `
  background-color: #321c64;
  vertical-align: bottom;
  width: 50%;
`

const headerImageStyle = `
  display: block;
  margin-left: auto;
  max-width: 100%;
  object-fit: cover;
  object-position: left;
`

const footerContainerStyle = `
  background: #f9f9fa;
  border-top: 1px solid #dddddd;
  padding: 24px 0;
`

const footerImageStyle = `
  display: block;
  margin: 24px auto 0;
`

const emailHeader = (data) => `
  <tr class='logo'>
    <td height='100'></td>
  </tr>
  <tr class='header'>
    <td>
      <table
        border='0'
        cellpadding='0'
        cellspacing='0'
        role='presentation'
        style='${headerTableStyle}'
      >
        <tr>
          <td>
            <h1>
              ${getMessage(data.heading)}
            </h1>
            ${data.subhead !== ''
              ? `<p>${getMessage(data.subhead)}</p>`
              : ''
            }
          </td>
          <td
            class='header-image'
            style='${headerImageContainerStyle}'
          >
            <img
              alt=''
              height='331'
              src='${images.header}'
              style='${headerImageStyle}'
              width='476'
            >
          </td>
        </tr>
      </table>
    </td>
  </tr>
`

const emailFooter = (data) => `
  <tr class='footer'>
    <td style='${footerContainerStyle}'>
      <p>
        ${getEmailFooterCopy(data)}
      </p>
      <p>
        ${getMessage('email-2022-hibp-attribution', {
          'hibp-link-attr': `href='${links(data).hibp}' rel='noopener'`
        })}
      </p>
      <img
        alt='${getMessage('mozilla')}'
        src='${images.footer}'
        style='${footerImageStyle}'
        width='130px'
      >
      <p>
        ${companyAddress}
      </p>
      <p>
        <a href='${links(data).legal}'>
          ${getMessage('legal')}
        </a>
        ${' • '}
        <a href='${links(data).termsAndPrivacy}'>
          ${getMessage('terms-and-privacy')}
        </a>
      </p>
    </td>
  </tr>
`

function getEmailFooterCopy (data) {
  const unsubLink = `
    <a href='${data.unsubscribeUrl}'>
      ${getMessage('email-unsub-link')}
    </a>
  `
  const faqLink = `
    <a href='${links(data).faq}'>${getMessage('frequently-asked-questions')}</a>
  `

  return getMessage('email-footer-blurb', {
    unsubLink,
    faqLink
  })
}

const getStyles = () => `
  <style>
    .email-body,
    .email-body * {
      margin: 0;
      padding: 0;
    }

    body.email-body,
    .email-container {
      color: black;
      font: normal 16px/1.2 sans-serif;
    }

    .email-container h1,
    .email-container p {
      margin: 12px auto;
      max-width: 600px;
      padding: 0 24px;
    }

    .email-container a {
      color: #592acb;
      text-decoration: none;
    }

    .email-container table {
      table-layout: fixed;
    }

    .email-container .logo > td {
      height: 100px;
      background-color: #f9f9fa;
      background-position: 50%;
      background-image: url('${images.logoLight}');
      background-repeat: no-repeat;
      background-size: 240px 50px;
      width: 100%;
    }

    @media screen and (max-width:600px) {
      .email-container .header-image {
        display: none;
      }
    }

    @media (prefers-color-scheme: dark) {
      .email-container .logo > td {
        background-image: url('${images.logoDark}')
      }
    }
  </style>
`

const getEmailContent = (data, partial) => {
  return `
    <table
      border='0'
      class='email-container'
      cellpadding='0'
      cellspacing='0'
      role='presentation'
      style='${tableStyle}'
    >
      ${emailHeader({
        heading: data.heading,
        subhead: data.subheading ?? ''
      })}
      ${partial(data)}
      ${emailFooter(data)}
    </table>
  `
}

const getPreviewTemplate = (data, partial) => `
  ${getStyles()}
  ${getEmailContent(data, partial)}
`

const getTemplate = (data, partial) => {
  return `
    <!doctype html>
    <html>
      <head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />

        <title>
          ${getMessage('brand-fx-monitor')}
        </title>

        ${getStyles()}
      </head>

      <body class='email-body' style='${bodyStyle}'>
        ${getEmailContent(data, partial)}
      </body>
    </html>
  `
}

export { getPreviewTemplate, getTemplate }
