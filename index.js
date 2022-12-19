const axios = require('axios');
const svgdom = require('svgdom');
const SVG = require('@svgdotjs/svg.js');
const TextToSVG = require('text-to-svg');

SVG.extend([SVG.Path, SVG.Circle], {
    rightmost: function () {
        return this.x() + this.width();
    },
    lowermost: function () {
        return this.y() + this.height();
    }
});

const whitneyBold = TextToSVG.loadSync(__dirname+'/fonts/WhitneyBoldRegular.ttf');
const whitneySemibold = TextToSVG.loadSync(__dirname+'/fonts/WhitneySemiboldRegular.ttf');
const whitneyMedium = TextToSVG.loadSync(__dirname+'/fonts/WhitneyMediumRegular.ttf');

const langs = require(__dirname+'/lang.json');

const API_BASE_URL = 'https://discord.com/api/v10';
const CDN_BASE_URL = 'https://cdn.discordapp.com';
const PADDING = 16;
const ICON_SIZE = 50;

const HEADER_FONT_SIZE = 12;
const HEADER_LINE_HEIGHT = 16;
const HEADER_MARGIN_BOTTOM = 12;

const SERVER_NAME_SIZE = 16;
const SERVER_NAME_LINE_HEIGHT = 20;
const SERVER_NAME_MARGIN_BOTTOM = 2;

const PRESENCE_FONT_SIZE = 14;
const PRESENCE_LINE_HEIGHT = 16;
const PRESENCE_TEXT_MARGIN_RIGHT = 8;

const PRESENCE_DOT_SIZE = 8;
const PRESENCE_DOT_MARGIN_RIGHT = 4;

const INVITE_WIDTH = 430;
const INVITE_HEIGHT = 110;

const BUTTON_WIDTH = 94.75;
const BUTTON_HEIGHT = 40;
const BUTTON_MARGIN_LEFT = 10;

const BADGE_MARGIN_RIGHT = 8;

const BADGES = {
    VERIFIED: 'M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z',
    PARTNERED: 'M10.5906 6.39993L9.19223 7.29993C8.99246 7.39993 8.89258 7.39993 8.69281 7.29993C8.59293 7.19993 8.39317 7.09993 8.29328 6.99993C7.89375 6.89993 7.5941 6.99993 7.29445 7.19993L6.79504 7.49993L4.29797 9.19993C3.69867 9.49993 2.99949 9.39993 2.69984 8.79993C2.30031 8.29993 2.50008 7.59993 2.99949 7.19993L5.99598 5.19993C6.79504 4.69993 7.79387 4.49993 8.69281 4.69993C9.49188 4.89993 10.0912 5.29993 10.5906 5.89993C10.7904 6.09993 10.6905 6.29993 10.5906 6.39993Z M13.4871 7.79985C13.4871 8.19985 13.2874 8.59985 12.9877 8.79985L9.89135 10.7999C9.29206 11.1999 8.69276 11.3999 7.99358 11.3999C7.69393 11.3999 7.49417 11.3999 7.19452 11.2999C6.39545 11.0999 5.79616 10.6999 5.29674 10.0999C5.19686 9.89985 5.29674 9.69985 5.39663 9.59985L6.79499 8.69985C6.89487 8.59985 7.09463 8.59985 7.19452 8.69985C7.39428 8.79985 7.59405 8.89985 7.69393 8.99985C8.09346 8.99985 8.39311 8.99985 8.69276 8.79985L9.39194 8.39985L11.3896 6.99985L11.6892 6.79985C12.1887 6.49985 12.9877 6.59985 13.2874 7.09985C13.4871 7.39985 13.4871 7.59985 13.4871 7.79985Z',
    HUB: [
        'M4.667 12.667a1.333 1.333 0 1 1 0-2.667 1.333 1.333 0 0 1 0 2.667Z',
        'M4.667 12a.667.667 0 1 1 0-1.333.667.667 0 0 1 0 1.333Zm-1.334-.667a1.333 1.333 0 1 0 2.667 0 1.333 1.333 0 0 0-2.667 0Z',
        'M8 12.667A1.333 1.333 0 1 1 8 10a1.333 1.333 0 0 1 0 2.667Z',
        'M8 12a.667.667 0 1 1 0-1.333A.667.667 0 0 1 8 12Zm-1.333-.667a1.333 1.333 0 1 0 2.666 0 1.333 1.333 0 0 0-2.666 0Z',
        'M8 6a1.333 1.333 0 1 1 0-2.667A1.333 1.333 0 0 1 8 6Z',
        'M8 5.333A.667.667 0 1 1 8 4a.667.667 0 0 1 0 1.333Zm-1.333-.666a1.333 1.333 0 1 0 2.666 0 1.333 1.333 0 0 0-2.666 0Z',
        'M11.333 12.667a1.333 1.333 0 1 1 0-2.667 1.333 1.333 0 0 1 0 2.667Z',
        'M11.333 12a.667.667 0 1 1 0-1.333.667.667 0 0 1 0 1.333ZM10 11.333a1.333 1.333 0 1 0 2.667 0 1.333 1.333 0 0 0-2.667 0Z',
        'M6 8.5a.833.833 0 0 0-.833.833v1.334h-1V9.333C4.167 8.321 4.987 7.5 6 7.5h4c1.012 0 1.833.82 1.833 1.833v1.334h-1V9.333A.833.833 0 0 0 10 8.5H6Z',
        'M7.5 11.333V4.667h1v6.666h-1Z'
    ],
}

const COMMON_COLORS = {
    joinButtonBackground: '#3ba55c',
    joinButtonText: '#ffffff',
    online: '#3ba55c',
    members: '#747f8d',
    badges: {
        PARTNERED: {
            flowerStar: '#7289da',
            icon: '#ffffff'
        },
        VERIFIED: {
            flowerStar: '#3ba55c',
            icon: '#ffffff'
        }
    }
}
  
const THEMES = {
    dark: {
        background: '#2f3136',
        serverName: '#ffffff',
        header: '#b9bbbe',
        serverIcon: '#36393f',
        acronymText: '#dcddde',
        presenceText: '#b9bbbe'
    },
    light: {
        background: '#f2f3f5',
        serverName: '#060607',
        header: '#4f5660',
        serverIcon: '#ffffff',
        acronymText: '#2e3338',
        presenceText: '#4f5660'
    }
}

async function fetchIcon(url) {
    let icon = await axios.get(url, { responseType: 'arraybuffer', headers: { "Accept-Encoding": "gzip,deflate,compress" }}).catch(function (err) {});
    return icon.data.toString('base64');
}

let getInvite = async function(inviteCode, options = {language: 'en', theme: 'dark'}) {
    let invite = await axios.get(`${API_BASE_URL}/invites/${inviteCode}?with_counts=true`, { headers: { "Accept-Encoding": "gzip,deflate,compress" }}).catch(function (err) {throw new ReferenceError('Unknown Discord Invite');});
    invite = invite.data;

    const locale = langs[options.language] || langs.en
    const window = svgdom.createSVGWindow()
    const document = window.document
    SVG.registerWindow(window, document)
    const canvas = SVG.SVG(document.documentElement)
    canvas.viewbox(0, 0, INVITE_WIDTH, INVITE_HEIGHT).width(INVITE_WIDTH).height(INVITE_HEIGHT)

    const themeColors = {
        ...COMMON_COLORS,
        ...(THEMES[options.theme] || THEMES.dark)
    }
    // Background
    canvas.rect(INVITE_WIDTH, INVITE_HEIGHT).radius(3).fill(themeColors.background)

    // Main Container
    const mainContainer = canvas.nested()
        .width(INVITE_WIDTH - 2 * PADDING)
        .height(INVITE_HEIGHT - 2 * PADDING)
        .move(PADDING, PADDING)

    // Header
    const headerContainer = mainContainer.nested().width(mainContainer.width()).height(HEADER_LINE_HEIGHT)
    headerContainer.path(whitneyBold.getD((invite.guild.features.includes('HUB') ? locale.header_hub : locale.header).toUpperCase(), { anchor: 'top left', fontSize: HEADER_FONT_SIZE })).fill(themeColors.header)

    // Content Container
    const contentContainer = mainContainer.nested()
        .width(mainContainer.width())
        .height(mainContainer.height() - headerContainer.height() - HEADER_MARGIN_BOTTOM)
        .move(0, headerContainer.height() + HEADER_MARGIN_BOTTOM)

    // Server Icon
    const squircle = contentContainer.rect(ICON_SIZE, ICON_SIZE).radius(16).fill(themeColors.serverIcon)
    if (invite.guild.icon) {
        const iconBase64 = await fetchIcon(`${CDN_BASE_URL}/icons/${invite.guild.id}/${invite.guild.icon}${invite.guild.icon.startsWith('a_') ? '.gif' : '.jpg'}`)
        const iconImage = contentContainer.image(`data:image/${invite.guild.icon.startsWith('a_') ? 'gif' : 'jpg'};base64,${iconBase64}`).size(ICON_SIZE, ICON_SIZE)
        iconImage.clipWith(squircle)
    }

    // Join button
    const buttonContainer = contentContainer.nested()
        .width(BUTTON_WIDTH)
        .height(BUTTON_HEIGHT)
        .move(contentContainer.width() - BUTTON_WIDTH, (contentContainer.height() - BUTTON_HEIGHT) / 2)
        .linkTo(link => {
            link.to(`https://discord.gg/${inviteCode}`).target('_blank')
        })
    buttonContainer.rect(BUTTON_WIDTH, BUTTON_HEIGHT)
        .radius(3)
        .fill(themeColors.joinButtonBackground)
    const joinButtonText = buttonContainer.path(whitneyMedium.getD(locale.button, { fontSize: 14 }))
        .fill(themeColors.joinButtonText)
    joinButtonText.move((BUTTON_WIDTH - joinButtonText.width()) / 2, (BUTTON_HEIGHT - joinButtonText.height()) / 2)

    let EXTRA_SERVER_NAME_PADDING = 0

    const innerContainer = contentContainer.nested()
        .width(contentContainer.width() - ICON_SIZE - PADDING - BUTTON_WIDTH - BUTTON_MARGIN_LEFT)
        .height(SERVER_NAME_LINE_HEIGHT + SERVER_NAME_MARGIN_BOTTOM + PRESENCE_LINE_HEIGHT)
        .x(ICON_SIZE + PADDING, 0)
    innerContainer.y((contentContainer.height() - innerContainer.height()) / 2)

    const badgeContainer = innerContainer.nested().y(2)

    // Feature Badges
    if (invite.guild.features.includes('VERIFIED') && invite.guild.features.includes('HUB')) {
        const circle = badgeContainer
            .circle(16)
            .fill(themeColors.badges.VERIFIED.flowerStar)
        for (const path of BADGES.HUB) { badgeContainer.path(path).fill(themeColors.badges.VERIFIED.icon) }
        EXTRA_SERVER_NAME_PADDING = circle.width() + BADGE_MARGIN_RIGHT
    } else if (invite.guild.features.includes('VERIFIED')) {
        const flowerStar = badgeContainer
            .path(Constants.SPECIAL_BADGE)
            .fill(themeColors.badges.VERIFIED.flowerStar)
        badgeContainer
            .path(BADGES.VERIFIED)
            .fill(themeColors.badges.VERIFIED.icon)
        EXTRA_SERVER_NAME_PADDING = flowerStar.width() + BADGE_MARGIN_RIGHT
    } else if (invite.guild.features.includes('PARTNERED')) {
        const flowerStar = badgeContainer
            .path(Constants.SPECIAL_BADGE)
            .fill(themeColors.badges.PARTNERED.flowerStar)
        badgeContainer
            .path(BADGES.PARTNERED)
            .fill(themeColors.badges.PARTNERED.icon)
        EXTRA_SERVER_NAME_PADDING = flowerStar.width() + BADGE_MARGIN_RIGHT
    }

    // Server Name
    const serverNameText = innerContainer.path(whitneySemibold.getD(invite.guild.name, { anchor: 'top left', fontSize: SERVER_NAME_SIZE }))
      .fill(themeColors.serverName)
      .x(EXTRA_SERVER_NAME_PADDING)
    serverNameText.y((SERVER_NAME_LINE_HEIGHT - serverNameText.height) / 2)

    const presenceContainer = innerContainer.nested()
      .height(PRESENCE_LINE_HEIGHT)
      .width(innerContainer.width())
      .y(SERVER_NAME_LINE_HEIGHT + SERVER_NAME_MARGIN_BOTTOM)

    // Online and member counts
    presenceContainer.circle(PRESENCE_DOT_SIZE)
        .fill(themeColors.online)
        .y((PRESENCE_LINE_HEIGHT - PRESENCE_DOT_SIZE) / 2)
    const presenceText = presenceContainer.path(whitneySemibold.getD(locale.online.replace('{{count}}', invite.approximate_presence_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')), { fontSize: PRESENCE_FONT_SIZE }))
        .fill(themeColors.presenceText)
        .x(PRESENCE_DOT_SIZE + PRESENCE_DOT_MARGIN_RIGHT)
    presenceText.y((PRESENCE_LINE_HEIGHT - presenceText.height()) / 2)
    presenceContainer.circle(PRESENCE_DOT_SIZE)
        .fill(themeColors.members)
        .y((PRESENCE_LINE_HEIGHT - PRESENCE_DOT_SIZE) / 2)
        .x(PRESENCE_DOT_SIZE + PRESENCE_DOT_MARGIN_RIGHT + presenceText.width() + PRESENCE_TEXT_MARGIN_RIGHT)
    const membersText = presenceContainer.path(whitneySemibold.getD(locale.members.replace('{{count}}', invite.approximate_member_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')), { fontSize: PRESENCE_FONT_SIZE }))
        .fill(themeColors.presenceText)
        .x(PRESENCE_DOT_SIZE + PRESENCE_DOT_MARGIN_RIGHT + presenceText.width() + PRESENCE_TEXT_MARGIN_RIGHT + PRESENCE_DOT_SIZE + PRESENCE_DOT_MARGIN_RIGHT)
    membersText.y((PRESENCE_LINE_HEIGHT - membersText.height()) / 2)
    return canvas.svg()
};

module.exports = {
    getInvite: getInvite,
    get: getInvite
}
