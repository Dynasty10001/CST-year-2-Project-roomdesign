import { extendTheme } from "@chakra-ui/react";
import "@fontsource/montserrat/"

const fontStyle = extendTheme({
  fonts: {
    heading: '"Montserrat", "sans-serif"',
    subHeading: '"Montserrat", "sans-serif"',
    body: '"Montserrat", "sans-serif"',
  },
  
});

export default fontStyle;