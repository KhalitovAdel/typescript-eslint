import rule, {
  ruleName,
  TMessageIds,
} from '../../src/rules/prefer-equality-enum-member';

import { RuleTester } from '../RuleTester';

const ruleTester = new RuleTester({
  parser: '@typescript-eslint/parser',
});

ruleTester.run(ruleName, rule, {
  valid: [
    `
enum Valid {
  A = 'A',
}
    `,
    `
enum Valid {}
    `,
  ],
  invalid: [
    {
      code: `
enum Invalid {
  A = 'B',
}
      `.trimRight(),
      errors: [
        {
          messageId: TMessageIds.notEqual,
          line: 3,
          suggestions: [
            {
              messageId: TMessageIds.notEqual,
              output: `
enum Invalid {
  A = 'A',
}
            `.trimRight(),
            },
          ],
        },
      ],
    },
    {
      code: `
enum Invalid {
  A = {},
}
      `,
      errors: [
        {
          messageId: TMessageIds.notEqual,
          line: 3,
        },
      ],
    },
  ],
});
