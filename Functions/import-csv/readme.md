# import-csv
This is a repository for the function: **import-csv**

The goal of the function is to import the contents of a CSV file (.csv) into a specific model.

Text and number property types can be imported correctly.
See below for limitation with other tested types. If the type is not mentioned below it has not been tested and use is at your own risk.

## Known limitations:

- Importing related data is NOT possible at the moment.
- Date/Time/Datetime types: The import file needs to support the mySQL format to be processed correctly.
- Checkbox properties: not supported at the moment.
- Price properties : separator need to be a dot and not a comma!

