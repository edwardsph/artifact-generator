const Generator = require('./src/generator');

var inquirer = require('inquirer');

const argv = require('yargs')
  .array('i')
  .alias('i', 'input')
  .describe('i', 'One or more ontology files that will be used to build Vocab Terms from.')
  .demandOption(
    'input',
    'At least one input vocabulary (i.e. RDF file) is required (since we have nothing to generate from otherwise!).'
  )

  .string('o')
  .alias('o', 'outputDirectory')
  .describe('o', 'The output directory for the generated artifact.')
  .default('o', './generated')

  .string('vtf')
  .alias('vtf', 'vocabTermsFrom')
  .describe('vtf', 'Generates Vocab Terms from only the specified ontology file.')

  .string('av')
  .alias('av', 'artifactVersion')
  .describe('av', 'The version of the Node module that will be built.')
  .default('av', '1.0.1')

  .alias('at', 'artifactType')
  .describe('at', 'The artifact type that will be generated.')
  .choices('at', ['nodejs']) // Add to this when other languages are supported.
  .default('at', 'nodejs')

  .strict().argv;

const generator = new Generator(argv);
generator.generate((data) => {
    // Craft questions to present to users
    const questions = [
        {
            type: 'input',
            name: 'name',
            message: 'Enter artifact name ...',
            default: data.name,
        },
        {
            type: 'input',
            name: 'version',
            message: 'Enter artifact version ...',
            default: data.version,
        },
    ];

    return inquirer.prompt(questions).then(answers => {
        return new Promise((resolve, reject) => {
            resolve({ ...data, ...answers });
        });
    });
}).catch(error => console.log(`Generation process failed: [${error}]`));
