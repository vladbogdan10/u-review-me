const cleanQuillEditor = (content: string) => {
  // remove groups of "<p><br></p>" in the begining and end of the string
  // if not preceded or followed by any other charater
  const pattern = /^(<p><br><\/p>)+|(<p><br><\/p>)+$/g;
  const cleanContent = content.replace(pattern, '');

  return cleanContent;
};

export default cleanQuillEditor;
