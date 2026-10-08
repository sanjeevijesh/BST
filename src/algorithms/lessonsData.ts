export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  content: string;
  interactivePrompt: string;
  initialTreeValues: number[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const lessonsData: Lesson[] = [
  {
    id: '01',
    title: 'What is a BST?',
    subtitle: 'Introduction to Binary Search Trees',
    description: 'Learn the structure and basic concepts of a Binary Search Tree.',
    content: `A **Binary Search Tree (BST)** is a hierarchical node-based data structure where each node has at most two children, referred to as the left child and the right child.

Unlike linear data structures (arrays, linked lists), trees store data hierarchically. A BST is a special type of binary tree that maintains a strict sorting property.

### Structure of a Node:
- **Value / Key**: The data stored in the node.
- **Left Pointer**: Points to the root of the left subtree.
- **Right Pointer**: Points to the root of the right subtree.
- **Parent Pointer (optional)**: Points back to the parent node.`,
    interactivePrompt: 'Generate a Random Tree and hover over nodes to inspect their values, depths, and parent pointers.',
    initialTreeValues: [50, 30, 70, 20, 40, 60, 80],
    quiz: {
      question: 'What is the maximum number of children any node in a Binary Search Tree can have?',
      options: ['1', '2', '3', 'Unlimited'],
      correctIndex: 1,
      explanation: 'By definition, a binary tree node can have a maximum of 2 children: a left child and a right child.'
    }
  },
  {
    id: '02',
    title: 'BST Properties',
    subtitle: 'The fundamental ordering rules',
    description: 'Understand the constraints that make a binary tree a search tree.',
    content: `For any given node in a valid Binary Search Tree, the following properties must hold:

1. **Left Subtree Rule**: The values of all nodes in the left subtree must be **strictly less** than the node's value.
2. **Right Subtree Rule**: The values of all nodes in the right subtree must be **strictly greater** than the node's value.
3. **No Duplicates**: A standard BST does not store duplicate values (although variations exist, we focus on standard unique keys).
4. **Subtree Validity**: Both the left and right subtrees must also be valid Binary Search Trees.

### Example:
For a root node with value **50**:
- Left child could be **30** (30 < 50)
- Right child could be **70** (70 > 50)
- Attempting to insert another **30** will be rejected.`,
    interactivePrompt: 'Try inserting the duplicate value 50 or 30 in the workspace. Observe how the visualizer handles it.',
    initialTreeValues: [50, 30, 70],
    quiz: {
      question: 'In a valid BST, if the root value is 45, which of these values CANNOT be in its left subtree?',
      options: ['20', '10', '40', '50'],
      correctIndex: 3,
      explanation: 'All values in the left subtree must be strictly less than the parent value (45). Since 50 > 45, it must be placed in the right subtree.'
    }
  },
  {
    id: '03',
    title: 'BST Insertion',
    subtitle: 'How to build the tree',
    description: 'Learn the step-by-step algorithm to place new nodes correctly.',
    content: `Inserting a new value into a BST is a recursive procedure. We must find the correct empty leaf slot that preserves the BST properties.

### Insertion Steps:
1. **Start at the Root**: If the tree is empty, create the root node and finish.
2. **Compare**: Compare the value to insert with the current node.
3. **Navigate Left**: If the value is less than the current node's value, check the left child.
   - If the left child is empty, insert the new node here.
   - Otherwise, recurse on the left subtree.
4. **Navigate Right**: If the value is greater than the current node's value, check the right child.
   - If the right child is empty, insert the new node here.
   - Otherwise, recurse on the right subtree.`,
    interactivePrompt: 'Enable "Step Mode" and insert the value 35. Click [Next Step] to watch the algorithm decide where to go.',
    initialTreeValues: [50, 30, 70, 20, 45],
    quiz: {
      question: 'Where would a new node with value 42 be placed in a tree with Root 50, Left Child 30, and Right Child of Left Child 40?',
      options: [
        'Left child of 30',
        'Left child of 40',
        'Right child of 40',
        'Right child of 50'
      ],
      correctIndex: 2,
      explanation: '42 is less than 50 (go left to 30), greater than 30 (go right to 40), and greater than 40 (go right of 40). Hence, it becomes the right child of 40.'
    }
  },
  {
    id: '04',
    title: 'BST Searching',
    subtitle: 'Find values in logarithmic time',
    description: 'Discover why BSTs excel at looking up values efficiently.',
    content: `Searching in a BST is highly efficient because at each step we discard half of the remaining tree, similar to binary search in a sorted array.

### Search Algorithm:
1. **Base Case**: If the current node is null, the value does not exist (Search Fail). If the current node's value matches the target, return it (Search Success).
2. **Compare and Route**:
   - If **Target < Current Value**, search recursively in the **left subtree**.
   - If **Target > Current Value**, search recursively in the **right subtree**.

### Search Path:
The sequence of nodes inspected during a search is called the **Search Path**. Its length corresponds to the number of comparisons made, which is bounded by the tree's height.`,
    interactivePrompt: 'Search for value 20. Note the search path highlighted in Amber, and check the statistics panel for comparisons.',
    initialTreeValues: [60, 40, 80, 20, 50, 70, 90],
    quiz: {
      question: 'What is the maximum number of comparisons needed to search a value in a perfectly balanced BST containing N nodes?',
      options: ['O(N)', 'O(N log N)', 'O(log N)', 'O(1)'],
      correctIndex: 2,
      explanation: 'In a balanced BST, the height is approximately log2(N). Therefore, the search path requires at most O(log N) comparisons.'
    }
  },
  {
    id: '05',
    title: 'BST Deletion',
    subtitle: 'Removing nodes cleanly',
    description: 'Master the three cases of deleting a node while preserving order.',
    content: `Node deletion is the most complex BST operation. We must handle three distinct structural scenarios.

### Case 1: Leaf Node (No Children)
- Simply remove the node by setting its parent's pointer to null.

### Case 2: One Child (Left OR Right)
- Bypass the node: link the parent of the deleted node directly to its child.

### Case 3: Two Children (Left AND Right)
- We cannot simply delete this node because it has two child subtrees to attach.
- Instead, find the node's **Inorder Successor** (the smallest value in its right subtree).
- Copy the Inorder Successor's value into the target node.
- Recursively delete the Inorder Successor (which is guaranteed to have at most one child, transforming the problem into Case 1 or 2).`,
    interactivePrompt: 'Delete node 50 (the root). Watch the visualizer find successor 60, swap values, and delete the successor node.',
    initialTreeValues: [50, 30, 70, 20, 40, 60, 80],
    quiz: {
      question: 'When deleting a node with two children, what node is typically used to replace its value?',
      options: [
        'Its left child',
        'Its right child',
        'Its inorder successor (min in right subtree)',
        'Its parent node'
      ],
      correctIndex: 2,
      explanation: 'The inorder successor (or inorder predecessor) is used because it is the next adjacent value in sorted order, ensuring the BST property remains valid after replacement.'
    }
  },
  {
    id: '06',
    title: 'Tree Traversals',
    subtitle: 'Visiting every node',
    description: 'Learn Inorder, Preorder, Postorder, and Level-Order traversals.',
    content: `Traversing a tree means visiting all nodes in a specific, systematic order.

### Depth-First Search (DFS) Traversals:
1. **Inorder (Left → Root → Right)**:
   - Traverses the left subtree, visits the root, then traverses the right subtree.
   - **Crucial Property**: For a valid BST, Inorder traversal yields values in **sorted ascending order**.
2. **Preorder (Root → Left → Right)**:
   - Visits the root, traverses the left subtree, then the right subtree. Useful for copying trees.
3. **Postorder (Left → Right → Root)**:
   - Traverses the left, then the right, and visits the root last. Useful for deleting/freeing a tree.

### Breadth-First Search (BFS) Traversal:
4. **Level-Order (Level 0 → Level 1 → Level 2...)**:
   - Visits nodes level-by-level, from left to right. Uses a queue queueing children.`,
    interactivePrompt: 'Run an [Inorder] traversal, and check the generated sequence. Notice how it is perfectly sorted.',
    initialTreeValues: [40, 20, 60, 10, 30, 50, 70],
    quiz: {
      question: 'Which traversal of a Binary Search Tree produces node values in sorted ascending order?',
      options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
      correctIndex: 1,
      explanation: 'Inorder traversal visits nodes in Left -> Root -> Right sequence. Because left is smaller and right is larger, this visits elements in sorted order.'
    }
  },
  {
    id: '07',
    title: 'Tree Height',
    subtitle: 'Measuring depth and levels',
    description: 'Understand height, depth, and levels in binary trees.',
    content: `To analyze BST performance, we must measure its vertical scale.

### Key Definitions:
- **Node Depth**: The number of edges from the root to the node. The root has depth 0.
- **Node Height**: The number of edges on the longest path from the node to a leaf. Leaf nodes have height 0.
- **Tree Height**: The height of the root node (i.e., the depth of the deepest node).
- **Levels**: The total number of horizontal tiers in the tree, equal to **Height + 1**.

### Height Calculation:
The height of a node is calculated recursively:
\`\`\`text
height(node) = max(height(node.left), height(node.right)) + 1
\`\`\`
If a node is null, its height is defined as **-1**.`,
    interactivePrompt: 'Hover over individual nodes in the visualizer to inspect their individual depths and heights.',
    initialTreeValues: [50, 25, 75, 12, 35],
    quiz: {
      question: 'What is the height of a BST containing only a single root node (no children)?',
      options: ['-1', '0', '1', '2'],
      correctIndex: 1,
      explanation: 'A node with no children has height 0, because there are 0 edges on the longest path to a leaf (the node itself is the leaf).'
    }
  },
  {
    id: '08',
    title: 'Balanced vs Unbalanced',
    subtitle: 'The shape of performance',
    description: 'Explore how tree balance directly determines search speeds.',
    content: `The shape of a BST depends entirely on the insertion order of its values.

### Balanced BST:
- Left and right subtrees of every node have roughly equal heights.
- Height is optimized at $O(\\log N)$.
- Operations remain fast: $O(\\log N)$.

### Unbalanced (Skewed) BST:
- If elements are inserted in sorted order (e.g. 10, 20, 30, 40, 50), the tree degenerates into a single long branch (a linked list).
- Height increases to $N - 1$.
- Operations degrade to $O(N)$ because search requires scanning every node.

### Self-Balancing Trees:
To prevent skewing, advanced trees like **AVL Trees** and **Red-Black Trees** perform automatic rotations during insertion/deletion to maintain balance.`,
    interactivePrompt: 'Switch to the "Balanced vs Skewed" Comparison page in the sidebar. Run a search to see the difference in comparisons.',
    initialTreeValues: [10, 20, 30, 40, 50],
    quiz: {
      question: 'What happens to BST search time complexity if values are inserted in strictly sorted ascending order?',
      options: [
        'It remains O(log N)',
        'It degrades to O(N)',
        'It improves to O(1)',
        'It becomes O(N log N)'
      ],
      correctIndex: 1,
      explanation: 'Inserting sorted items creates a right-skewed tree that functions like a linked list, degrading operations to O(N) linear time.'
    }
  },
  {
    id: '09',
    title: 'Time Complexity',
    subtitle: 'Big-O notation analysis',
    description: 'Summarize the algorithmic performance of Binary Search Trees.',
    content: `Here is the comprehensive complexity summary for Binary Search Tree operations:

| Operation | Average Case | Worst Case (Skewed) | Space Complexity |
| :--- | :--- | :--- | :--- |
| **Search** | $O(\\log N)$ | $O(N)$ | $O(H)$ recursion stack |
| **Insert** | $O(\\log N)$ | $O(N)$ | $O(H)$ recursion stack |
| **Delete** | $O(\\log N)$ | $O(N)$ | $O(H)$ recursion stack |

Where:
- **$N$** is the number of nodes in the tree.
- **$H$** is the height of the tree.

### Summary:
BSTs offer efficient logarithmic operations on average, but are highly vulnerable to order of insertions. This is why self-balancing trees are preferred in production search databases (like B-Trees in database indexes).`,
    interactivePrompt: 'Go to the Challenges page to check your overall knowledge and score a perfect streak!',
    initialTreeValues: [50, 25, 75, 12, 37, 60, 85],
    quiz: {
      question: 'What is the average time complexity of inserting a node in a BST?',
      options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
      correctIndex: 1,
      explanation: 'On average, a BST has a height of log N, allowing node insertion in O(log N) time.'
    }
  }
];
