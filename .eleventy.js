module.exports = function (eleventyConfig) {
  // Copy static assets as-is
  eleventyConfig.addPassthroughCopy("src/css");
  eleventyConfig.addPassthroughCopy("src/js");

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};
