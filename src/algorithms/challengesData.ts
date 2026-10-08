export interface MCQChallenge {
  id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface BuildTreeChallenge {
  id: string;
  name: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  instruction: string;
  availableValues: number[];
  targetSequence: number[]; // Sequence to insert to generate the target tree model programmatically
}

export const mcqChallenges: MCQChallenge[] = [
  {
    id: 'mcq-1',
    difficulty: 'Easy',
    question: 'Which of the following is true for any node in a valid Binary Search Tree?',
    options: [
      'All nodes in left and right subtrees are equal to node.',
      'Left subtree values < Node value < Right subtree values.',
      'Left child value > Node value > Right child value.',
      'All children have exactly the same depth.'
    ],
    correctIndex: 1,
    explanation: 'The fundamental BST property states that the left subtree contains keys smaller than the parent node, and the right subtree contains keys larger than the parent node.'
  },
  {
    id: 'mcq-2',
    difficulty: 'Easy',
    question: 'What is the time complexity of searching a node in a highly skewed (unbalanced) BST of size N?',
    options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
    correctIndex: 2,
    explanation: 'A skewed BST degrades to a single line structure like a linked list. In the worst case, searching requires checking all N nodes, which takes O(N) linear time.'
  },
  {
    id: 'mcq-3',
    difficulty: 'Medium',
    question: 'If a BST is traversed using Inorder Traversal, in what order are the elements visited?',
    options: [
      'Random order',
      'Sorted descending order',
      'Sorted ascending order',
      'Reverse level-order'
    ],
    correctIndex: 2,
    explanation: 'Inorder traversal visits nodes in the order Left -> Root -> Right. Since the left subtree has smaller values and the right subtree has larger values, this results in elements sorted in ascending order.'
  },
  {
    id: 'mcq-4',
    difficulty: 'Medium',
    question: 'During deletion of a node with two children, which node is selected to swap its value with?',
    options: [
      'The largest node in the left subtree, or smallest in the right subtree.',
      'The immediate parent node.',
      'A random leaf node.',
      'The root node of the entire tree.'
    ],
    correctIndex: 0,
    explanation: 'To maintain the BST property, we replace the deleted node with its inorder successor (smallest in right subtree) or inorder predecessor (largest in left subtree).'
  },
  {
    id: 'mcq-5',
    difficulty: 'Hard',
    question: 'How many different Binary Search Trees can be formed with 3 distinct keys?',
    options: ['3', '4', '5', '6'],
    correctIndex: 2,
    explanation: 'The number of unique BSTs with N keys is given by the N-th Catalan Number, C(N) = (2N)! / ((N+1)!N!). For N = 3, C(3) = 6! / (4! * 3!) = 5 unique trees.'
  },
  {
    id: 'mcq-6',
    difficulty: 'Hard',
    question: 'Which of the following self-balancing BST systems automatically rebalances itself during insertions by checking node heights?',
    options: [
      'B-Tree',
      'AVL Tree',
      'Splay Tree',
      'Binary Heap'
    ],
    correctIndex: 1,
    explanation: 'An AVL tree is a self-balancing binary search tree where the height difference between left and right subtrees (the balance factor) of any node cannot exceed 1. If it does, rotations are performed to restore balance.'
  }
];

export const buildTreeChallenges: BuildTreeChallenge[] = [
  {
    id: 'build-1',
    name: 'Simple Balanced Triad',
    difficulty: 'Easy',
    instruction: 'Recreate a simple balanced tree with Root 50, Left 30, and Right 70.',
    availableValues: [30, 50, 70],
    targetSequence: [50, 30, 70]
  },
  {
    id: 'build-2',
    name: 'Left Skewed Line',
    difficulty: 'Easy',
    instruction: 'Create a left-skewed tree where values decrease sequentially: 40 -> 30 -> 20.',
    availableValues: [20, 30, 40],
    targetSequence: [40, 30, 20]
  },
  {
    id: 'build-3',
    name: 'Subtree Explorer',
    difficulty: 'Medium',
    instruction: 'Construct a BST where 40 is Root, 20 is Left child, 60 is Right child, and 30 is child of 20.',
    availableValues: [20, 30, 40, 60],
    targetSequence: [40, 20, 60, 30]
  },
  {
    id: 'build-4',
    name: 'Zig-Zag Tree',
    difficulty: 'Medium',
    instruction: 'Build a zig-zag tree: 50 -> 30 -> 40.',
    availableValues: [30, 40, 50],
    targetSequence: [50, 30, 40]
  },
  {
    id: 'build-5',
    name: 'The Perfect Height-2 Tree',
    difficulty: 'Hard',
    instruction: 'Recreate a perfect Binary Search Tree of height 2 containing values 10 through 70.',
    availableValues: [10, 20, 30, 40, 50, 60, 70],
    targetSequence: [40, 20, 60, 10, 30, 50, 70]
  },
  {
    id: 'build-6',
    name: 'Unbalanced Pyramid',
    difficulty: 'Hard',
    instruction: 'Build a complex skewed tree structure: Root 30, Left 10, Right 50, and 50 has children 40 and 60.',
    availableValues: [10, 30, 40, 50, 60],
    targetSequence: [30, 10, 50, 40, 60]
  }
];

// Helper to check if two BST structures are identical
import type { BSTNode } from './bst';

export function areTreesIdentical(a: BSTNode | null, b: BSTNode | null): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.value === b.value &&
    areTreesIdentical(a.left, b.left) &&
    areTreesIdentical(a.right, b.right)
  );
}
