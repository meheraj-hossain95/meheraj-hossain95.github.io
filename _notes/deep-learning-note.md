---
layout: article
title: "Deep Learning Foundations"
description: "A practical reference covering neurons, activations, loss functions, backpropagation, optimizers, regularization, normalization, and mixed precision training."
date: 2026-08-15
---

## The Neuron, Weights, and Bias

A neuron is a tiny decision-maker. It takes several numeric inputs, judges how important each one is (weight), adds a baseline preference (bias), and produces one output number.

```
z = Σ(w_i * x_i) + b
a = f(z)
```

- **z (pre-activation / logit):** the raw weighted sum of inputs plus bias — just a linear combination, before anything non-linear happens.
- **f (activation function):** a non-linear function applied to `z` (ReLU, sigmoid, GELU, etc.).
- **a (activation / output):** the neuron's final output, `a = f(z)` — this is what gets passed on as input to the next layer. Without `f`, `a` would just equal `z`, and stacking such neurons would collapse into one big linear function no matter how many layers you add — this is exactly why `f` must be non-linear.
- **Weights (w):** strength/direction of influence of each input. Learned.
- **Bias (b):** shifts the decision boundary; lets the neuron fire even when all inputs are 0. Without bias, every neuron's decision boundary is forced through the origin — a real limitation.
- **Activation (f):** introduces non-linearity (see below). Without it, stacking layers = one big linear function, no matter how deep.

> **Why do we need bias?** → to allow the activation boundary to not pass through origin, giving the model more flexibility.

## Activation Functions

Activation functions determine whether and how strongly a neuron's output is passed to the next layer. They are the primary source of non-linearity in neural networks. Without activation functions, stacking multiple layers would still behave like a single linear function.

| Function | Range | Notes |
|---|---|---|
| **Sigmoid** | (0, 1) | Maps any input to a probability between 0 and 1. Saturates for very large positive or negative inputs, causing vanishing gradients, so it is rarely used in hidden layers. Not zero-centered, which slows optimization. Mainly used for binary classification outputs and LSTM/GRU gates. |
| **Tanh** | (-1, 1) | Similar to Sigmoid but zero-centered, making optimization easier. Still suffers from vanishing gradients due to saturation. Common in older RNNs. |
| **ReLU** | [0, ∞) | Fast, computationally cheap, and does not saturate for positive values, making it the default activation for many CNNs and MLPs. Can suffer from the Dying ReLU problem, where neurons always output 0 and stop learning after large negative updates. |
| **Leaky ReLU** | (-∞, ∞) | Fixes dying ReLU by allowing a small negative slope. |
| **GELU** | ~(-0.17, ∞) | Smooth activation that gradually scales inputs instead of making a hard keep/discard decision like ReLU. Small values are partially passed while large positive values are mostly preserved. Used in BERT, GPT, ViT, and many Transformer models because it usually gives better optimization and accuracy. |
| **Softmax** | (0, 1), sums to 1 | Converts a vector of logits into a probability distribution where all outputs sum to 1. Used in multi-class classification and the attention mechanism of Transformers. Unlike Sigmoid, Softmax makes the outputs compete with each other, so increasing one probability decreases the others. |
| **SwiGLU / GeGLU** | Depends on input | Modern gated activation used in the feed-forward network (MLP) of LLaMA, Mistral, Gemma, Qwen, DeepSeek, and other recent LLMs. Instead of using a single activation (like GELU), the input is split into two branches: one learns what features to compute, while the other acts as a gate that decides how much of each feature should pass through. The two branches are multiplied element-wise before the final linear layer. This makes the MLP more expressive and consistently outperforms a standard GELU-based MLP at similar computational cost. |

## Loss Functions

A loss function measures how wrong a model's prediction is. During training, the objective is to minimize the loss by updating the model's parameters using gradient descent.

- **MSE (Mean Squared Error)** — Used for regression problems: `(1/n) * Σ(y - ŷ)²`.
- **Cross-Entropy** — Used for classification problems: `-Σ(y_i * log(ŷ_i))`.

## Forward Pass & Backpropagation

**Forward pass:** During the forward pass, input data moves through the network layer by layer until a prediction is produced. At the same time, intermediate values are stored because they will be needed later during gradient computation.

```
input → layers → prediction → loss
```

**Backpropagation:** Backpropagation computes how much each weight contributed to the final loss. It starts from the output layer and moves backward through the network, applying the Chain Rule to compute gradients.

For each layer, backpropagation needs:
1. The local derivative of that layer.
2. The gradient received from the next layer.

```
∂L/∂w_l = (∂L/∂a_L) * (∂a_L/∂a_L-1) * ... * (∂a_l/∂w_l)
```

### Vanishing / Exploding Gradients

A gradient tells the model how much each weight should change during training.

- **Vanishing Gradient:** When gradients become extremely small, early layers receive almost no useful update. Result: early layers learn very slowly or may stop learning.
- **Exploding Gradient:** When gradients become extremely large, weight updates become too large. Result: training becomes unstable and the loss may become NaN or Inf.

## Gradient Descent

Gradient Descent is an optimization method used to minimize the model's loss. The basic idea is: calculate loss → calculate gradient → update weights → repeat. The goal is to move the model toward a point where the loss is smaller.

### Types of Gradient Descent

They mainly differ in how much data is used for one update.

- **Batch Gradient Descent:** Uses the entire training dataset to calculate one gradient before updating the weights. It gives a stable gradient but becomes expensive for large datasets.
- **Stochastic Gradient Descent (SGD):** Uses one training example for each update, producing frequent but noisy updates. Literal one-sample-at-a-time training is uncommon in modern large-scale deep learning.
- **Mini-batch Gradient Descent:** Uses a small batch of training examples for each update, providing a practical balance between computational efficiency, gradient stability, and GPU utilization. This is the standard approach in modern deep learning.

> **Modern practice** → Most neural networks are trained using mini-batches.

## Optimizers

Determines how the weights should be updated after the gradient has been calculated. Different optimizers use the gradient in different ways to make training faster, more stable, or more memory-efficient.

- **SGD:** Updates weights mainly according to the current gradient and learning rate. It is simple and can work very well, especially with momentum and a suitable learning-rate schedule.
- **Momentum:** Keeps a running direction from previous gradients, allowing the optimizer to move faster in consistent directions and reducing unnecessary zig-zagging.
- **RMSprop:** Adapts the learning rate of each parameter according to the recent magnitude of its gradients, giving relatively smaller updates to parameters with consistently large gradients.
- **Adam:** Combines momentum-like tracking of gradient direction with RMSprop-like adaptive learning rates, making it a strong general-purpose optimizer.
- **AdamW:** A version of Adam that decouples weight decay from the adaptive gradient update. It is a common choice for modern deep learning, especially Transformer-based models.
- **Muon:** A newer optimizer that uses matrix-based updates and has shown promising computational efficiency for large neural-network and LLM training. It is an emerging alternative to AdamW rather than a universal replacement.

## Learning Rate & Schedulers

The learning rate (LR) controls how large the weight updates are during training. A learning rate that is too large can make training unstable, while one that is too small can make training unnecessarily slow.

- **Learning-rate scheduling:** Changes the learning rate during training so that the model can make larger progress early and more careful updates later.
- **Warmup:** Starts with a small learning rate and gradually increases it to the target learning rate during the first part of training, helping stabilize early optimization.
- **Decay:** Gradually reduces the learning rate during training, allowing the model to make smaller updates as optimization progresses. Common methods:
  - **Step decay:** reduce LR after fixed intervals
  - **Linear decay:** gradually decrease LR
  - **Cosine decay:** smoothly decrease LR using a cosine-shaped schedule

## Regularization

Regularization means techniques used to reduce overfitting — techniques that trade a bit of training accuracy for better generalization by preventing the model from memorizing noise.

- **L1 Regularization:** Adds a penalty based on the absolute values of weights, encouraging some weights to become exactly zero and producing a sparse model (a model where some weights are exactly zero).
- **L2 Regularization:** Adds a penalty based on the squared values of weights, discouraging large weights and keeping them small; in modern deep learning, this is commonly implemented as weight decay.
- **Dropout:** Randomly turns off a fraction of neurons during training, preventing the model from relying too heavily on specific neurons and encouraging more robust representations.
- **Early Stopping:** Stops training when validation performance stops improving, usually keeping the model checkpoint with the best validation performance to reduce overfitting.
- **Label Smoothing:** Replaces hard 0/1 labels with slightly softer labels, preventing the model from becoming too confident in its predictions.
- **Data Augmentation:** Creates realistic variations of training data while keeping the same label, helping the model learn general patterns instead of memorizing specific training examples.
- **Mixup:** Combines two training examples and their labels in the same proportion, creating intermediate training examples that encourage smoother predictions and better generalization.

## Normalization (BatchNorm vs LayerNorm)

Rescales activations inside a neural network to make optimization more stable and efficient.

- **BatchNorm:** Normalizes each feature using statistics calculated across the samples in a mini-batch.
- **LayerNorm:** Normalizes the features within each individual sample/token, so it does not depend on other samples in the batch.
- **RMSNorm:** A simpler alternative to LayerNorm that removes mean-centering and mainly rescales activations using their root-mean-square magnitude.

## Gradient Clipping

Gradient clipping is a technique used to prevent exploding gradients. If the gradient becomes too large, we reduce its size before updating the weights.

## Mixed Precision Training

Mixed-precision training uses different numerical precisions during training, usually lower precision for most computation and higher precision where needed for stability. Using lower precision can:

- Reduce GPU memory usage
- Increase training speed
- Allow larger batches or models to fit in memory
- Improve GPU/TPU utilization

- **FP32:** A 32-bit floating-point format with high numerical precision. It is more expensive in memory and computation but is useful when numerical stability is important.
- **FP16:** A 16-bit format that uses less memory and can be faster than FP32, but its smaller numerical range makes it more vulnerable to underflow and overflow.
- **Loss scaling:** Multiplies the loss by a large number before calculating gradients so that very small FP16 gradients do not become zero. The gradients are then scaled back before the update.
- **BF16:** A 16-bit format with a similar numerical range to FP32 but less precision. Its large numerical range makes it much more stable than FP16 for many deep-learning workloads.
- **FP8:** An 8-bit floating-point format that can further reduce memory use and increase computational speed. It is increasingly used in large-scale training but requires more careful numerical management.

> **Modern practice** → BF16 is commonly preferred for Transformer and LLM training when supported by the hardware.

## Epoch, Batch Size, Iteration

- **Batch:** A group of training examples processed together before calculating an update.
- **Training Step / Iteration:** One optimization update, normally after one batch has been processed. Batch of 32 → calculate loss → calculate gradients → update weights → 1 step.
- **Epoch:** One complete pass through the training dataset. Suppose the dataset contains 10,000 samples and the batch size is 100. Now, 10,000 ÷ 100 = 100 steps per epoch.

## Overfitting / Underfitting & Bias-Variance

- **Underfitting:** The model is too simple or insufficiently trained to learn the important patterns in the data. Poor performance on both training and validation data.
- **Overfitting:** The model learns the training data too specifically, including noise or details that do not generalize to unseen data. Very good training performance but significantly worse validation/test performance.
- **Bias:** The error caused by a model being too simple or too restricted to learn the real pattern in the data. The model consistently makes similar mistakes because it cannot capture the complexity of the problem. High Bias → Underfitting.
- **Variance:** The error caused by a model being too sensitive to the particular training data it sees. The model learns the training data too specifically, so its predictions can change significantly when the training data changes. High Variance → Overfitting.