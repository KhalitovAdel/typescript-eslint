import * as util from '../util';
import {
  TSESTree,
  AST_NODE_TYPES,
  TSESLint,
  ASTUtils,
} from '@typescript-eslint/experimental-utils';

export enum TMessageIds {
  notEqual = 'notEqual',
}

export const ruleName = 'prefer-equality-enum-member';

export default util.createRule<unknown[], TMessageIds>({
  name: ruleName,
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Use key === value in enum',
      recommended: false,
      suggestion: true,
      category: 'Best Practices',
    },
    messages: {
      notEqual: 'Enum key must be equal enum value',
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      TSEnumDeclaration: (node: TSESTree.TSEnumDeclaration): void => {
        node.members.forEach(member => {
          if (
            member.computed ||
            member.initializer?.type !== AST_NODE_TYPES.Literal ||
            !ASTUtils.isIdentifier(member.id)
          ) {
            return context.report({
              node: member,
              messageId: TMessageIds.notEqual,
            });
          }

          const name = member.id.name;

          if (name !== member.initializer.value) {
            context.report({
              node: member,
              messageId: TMessageIds.notEqual,
              data: {
                name,
              },
              suggest: [
                {
                  messageId: TMessageIds.notEqual,
                  data: { name },
                  fix: (fixer): TSESLint.RuleFix => {
                    return fixer.replaceText(member, `${name} = '${name}'`);
                  },
                },
              ],
            });
          }
        });
      },
    };
  },
});
