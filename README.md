<p align="center">
  <img src="https://raw.githubusercontent.com/FAXES/disinvite/main/logo.png" style="width: 80%;" alt="logo" />
</p>

Disinvite allows you to generate a live SVG of a Discord invite, with member counts and server status (hub, partnered, or verified). These can be used anywhere; GitHub README's, websites, or anywhere that can display an image.

---

#### Functions:
**disinvite.getInvite(InviteCode [, options])**
**disinvite.get(InviteCode [, options])**

*getInvite() and get() are the same function.*

**Options:**
**options.theme**: "dark" or "light". Defaults to "Dark"
**options.language**: ISO 639-1 language code. Defaults to "en"

#### Example:

```js
const disinvite = require('disinvite');

disinvite.getInvite("faxes").then(svg => {
    fs.writeFileSync(`./invite.svg`, svg);
});

disinvite.get("faxes", {theme: "light", language: "es"}).then(svg => {
    res.download(svg);
});
```

#### Notes:
- Ensure you're using a permanent invite code as old ones will return an error.

---

If you're looking for a live version online you're able to use the below URL:
```
https://api.weblutions.com/discord/invite/INVITE_CODE

https://api.weblutions.com/discord/invite/INVITE_CODE/light
```

---

*Part of this package originally made by the [invidget](https://github.com/SwitchbladeBot/invidget) team.*