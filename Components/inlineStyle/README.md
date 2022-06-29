# inlineStyle component

This component can be used to load in inline styles without using an external css endpoint/file.

Originally created for Mediahuis because they wanted to override the font-size in components without having to create a custom component for them.

The css can be added right away to the multiline, for example:

```
.MuiInputBase-input {
  font-size: 11px;
  font-family: "Helvetica"
}

.MuiTypography-body2 {
  font-size: 9px;
}
.MuiMenu-list .MuiMenuItem-root {
  font-size: 9px;
}
.MuiInputBase-input {
  font-size: 9px;
}
```

The css is included via a regular `<style>` tag on the page. All tabs and spaces are ignored.