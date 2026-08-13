---
layout: article
title: PyTorch Tutorial
description: Easy Pytorch Tutorial
date: 2026-08-13
tags:
  - pytorch
  - deep-learning
  - tensor
  - training
---

# Tensor Creation

A **tensor** is the fundamental data structure in PyTorch. Think of it as a multi-dimensional array (like a NumPy array), but with two superpowers: it can run on a GPU, and PyTorch can automatically track the operations.

```python
import torch

data = [[1, 2, 3],
        [2, 1, 2],
        [1, 5, 2]]

torch.tensor(data)          # From Python list
torch.zeros((3, 3))         # All zeros
torch.ones((3, 3))          # All ones
torch.randn((3, 3))         # Random values (Normal distribution)
torch.arange(0, 10, 2)      # [0, 2, 4, 6, 8] — like Python's range()
torch.linspace(0, 1, 5)     # 5 evenly spaced values between 0 and 1
```

---

# Tensor Attributes

Every tensor stores some useful information about itself.

| Attribute | Description |
|-----------|-------------|
| `shape` | Size of each dimension (most commonly used). |
| `ndim` | Number of dimensions (axes). |
| `dtype` | Data type such as `float32`, `int64`. |
| `device` | Where the tensor is stored (`cpu` or `cuda`). |

```python
tensor = torch.randn(3, 4)

print(tensor.shape)    # torch.Size([3, 4])
print(tensor.ndim)     # 2
print(tensor.dtype)    # torch.float32
print(tensor.device)   # cpu
```

---

# Reshaping

Sometimes the data has the correct values but the wrong shape. Reshaping changes only the **dimensions**, never the underlying data or the number of elements.

```python
tensor.reshape(...)     # change shape, total element count must match
tensor.flatten()        # collapse everything into 1D
tensor.unsqueeze(dim)   # insert a size-1 dimension at `dim`
tensor.squeeze(dim)     # remove a size-1 dimension at `dim`
torch.cat([a, b], dim)  # join tensors along an existing dimension
torch.stack([a, b])     # join tensors along a brand-new dimension
```

```python
x = torch.tensor([[1, 2],
                  [3, 4]])

x.reshape(4)
# tensor([1, 2, 3, 4])

x.flatten()
# tensor([1, 2, 3, 4])
```

`unsqueeze`/`squeeze` come up constantly. e.g. a model expects a batch dimension `[1, C, H, W]` but you only have a single image `[C, H, W]`:

```python
img = torch.randn(3, 32, 32)     # [C, H, W] — one image
batch = img.unsqueeze(0)         # [1, C, H, W] — "pretend batch of 1"
img_again = batch.squeeze(0)     # back to [C, H, W]
```

---

# Indexing

Access specific elements, rows, or columns.

```python
tensor[i]          # Row or element
tensor[:, i]       # Column
tensor[i, j]       # Single element
```

```python
x = torch.tensor([[1, 2, 3],
                  [4, 5, 6]])

x[0]
# tensor([1, 2, 3])

x[:, 1]
# tensor([2, 5])

x[1, 2]
# tensor(6)
```

---

# Element-wise Operations

Arithmetic operators work **element by element**.

```python
x + y
x - y
x * y
x / y
```

```python
x = torch.tensor([1, 2, 3])
y = torch.tensor([4, 5, 6])

x + y
# tensor([5, 7, 9])
```

---

# Matrix Multiplication

Unlike `*` (element-wise), matrix multiplication follows the rules of linear algebra: the inner dimensions must match.

```python
x @ y
torch.matmul(x, y)
```

```python
x = torch.tensor([[1, 2],
                  [3, 4]])

y = torch.tensor([[5, 6],
                  [7, 8]])

x @ y
```

---

# Statistics

```python
tensor.mean()
tensor.sum()
tensor.max()
tensor.min()

tensor.argmax(dim=...)
tensor.argmin(dim=...)
```

### `argmax()` and `argmin()`

They return the **index** of the max/min value, not the value itself.

```python
tensor.argmax(dim=0)    # Column-wise
tensor.argmax(dim=1)    # Row-wise
```

---

# Data Type Conversion

```python
tensor.float()      # float32
tensor.long()       # int64
tensor.int()        # int32
tensor.bool()       # bool
```

---

# Device (CPU / GPU)

```python
tensor.to(device)

tensor.cpu()
tensor.cuda()
```

```python
device = "cuda" if torch.cuda.is_available() else "cpu"

tensor = tensor.to(device)
```

---

# NumPy Conversion

```python
tensor.numpy()          # Tensor -> NumPy (CPU only)

torch.from_numpy(arr)   # NumPy -> Tensor
```

---

# Useful Checks

Detect invalid values before training silently breaks. Especially useful when debugging exploding gradients or numerical instability (a loss that suddenly becomes `nan`).

```python
torch.isnan(x)      # NaN values
torch.isinf(x)      # Infinite values
```

---

# Autograd (Automatic Differentiation)

This is the piece that makes "learning" possible. Any tensor created with `requires_grad=True` has its operations tracked in a computation graph. Calling `.backward()` on a final scalar (like a loss) walks that graph backward and fills in `.grad` for every tensor that led to it.

```python
x = torch.tensor(2.0, requires_grad=True)
y = x ** 2 + 3 * x

y.backward()        # computes dy/dx
print(x.grad)        # tensor(7.)   since dy/dx = 2x + 3, at x=2 -> 7
```

You'll almost never write this by hand for a real model — `nn.Module` parameters have `requires_grad=True` automatically, and the training loop calls `.backward()` for you. But two related tools show up everywhere:

- **`torch.no_grad()`** — a context manager that turns tracking off (used for validation/inference).
- **`tensor.detach()`** — returns a copy of a tensor that's no longer connected to the computation graph (useful when you want a value without it affecting gradients).

---

# Dataset (`torch.utils.data.Dataset`)

You implement three methods:

| Method | Job |
|---|---|
| `__init__()` | Load or store the raw data (arrays, file paths, a dataframe, etc.). Runs once. |
| `__len__()` | Return the total number of samples. Tells PyTorch when one epoch ends. |
| `__getitem__(idx)` | Given an index, return **one** `(input, label)` sample, as tensors. |

A minimal, working example:

```python
import torch
from torch.utils.data import Dataset

class MyDataset(Dataset):
    def __init__(self, features, labels):
        self.features = torch.tensor(features, dtype=torch.float32)
        self.labels = torch.tensor(labels, dtype=torch.long)

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        return self.features[idx], self.labels[idx]
```

---

# DataLoader (`torch.utils.data.DataLoader`)

A **DataLoader** wraps a Dataset and automatically:

- Groups samples into batches
- Shuffles data
- Loads data in parallel
- Feeds batches to the training loop

```python
from torch.utils.data import DataLoader

loader = DataLoader(
    dataset,
    batch_size=32,
    shuffle=True,
    num_workers=4,
    pin_memory=True,
    drop_last=False
)

for x, y in loader:
    print(x.shape, y.shape)   # x: [32, ...], y: [32]
    break
```

---

# Important DataLoader Parameters

### `batch_size`

Number of samples processed together in one iteration.

```python
batch_size=32
```

Common values: `16`, `32`, `64`, `128`.

---

### `shuffle`

Randomizes the sample order every epoch.

```python
shuffle=True
```

`True` → Training  `False` → Validation / Test (never shuffle val/test — keeps evaluation reproducible and comparable across runs).

---

### `num_workers`

Number of CPU processes used to load data in the background, in parallel with the GPU doing the actual training.

```python
num_workers=4
```

`0` → Single process (simplest, good for debugging)  `2–8` → Usually faster once your loading pipeline works.

---

### `pin_memory`

Speeds up CPU → GPU transfer when training on a CUDA GPU. Set `True` if you have a GPU, ignored otherwise.

```python
pin_memory=True
```

---

### `drop_last`

Controls what happens to the final, possibly-smaller batch of an epoch.

```python
drop_last=False
```

`False` → Keep the final smaller batch
`True` → Drop it — useful when every batch must be an identical size (some architectures, e.g. certain BatchNorm setups, require this).

---

# Train / Validation / Test Split

| Split | Purpose |
|--------|---------|
| Train | Updates model weights. |
| Validation | Tunes hyperparameters and monitors overfitting during training. |
| Test | Used only once, at the very end, for final evaluation. |

Typical splits: `80 / 10 / 10` or `70 / 15 / 15`.

```python
from torch.utils.data import random_split

train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size

train_ds, val_ds = random_split(dataset, [train_size, val_size])
```

---

# Building Models — `nn.Module`

Every model you build in PyTorch — from a two-line linear model to a full transformer — is a Python class that inherits from `nn.Module`. It's worth slowing down here since everything else (training, saving, GPUs) is built on top of this pattern.

**Why inherit from `nn.Module` at all?** Because it does a lot of bookkeeping for you automatically, as soon as you follow its rules:

- **It tracks every layer you assign as an attribute.** When you write `self.fc1 = nn.Linear(10, 32)` inside `__init__`, `nn.Module` notices and registers it — that's how `model.parameters()` can later find every learnable weight, even ones buried inside sub-modules, without you manually listing them.
- **It gives you `.to(device)`, `.train()`, `.eval()`, `.state_dict()`** for free, applied recursively to every layer inside the model.
- **It gives you hooks** — a mechanism other tools use to inspect or modify activations, which is why you call the model itself (`model(x)`) instead of `model.forward(x)` directly (calling `model(x)` runs the hooks too; calling `.forward()` bypasses them).

**The four-step recipe, in words:**

1. **Inherit from `nn.Module`.** This is what plugs you into all of the above.
2. **Call `super().__init__()` first, before anything else.** This runs `nn.Module`'s own setup code, which creates the internal bookkeeping (like the dictionary that tracks your layers). If you skip this, assigning `self.fc1 = ...` afterward will silently fail to register the layer, and `model.parameters()` will come back empty — a confusing bug to debug later, so just always do it first.
3. **Declare your layers inside `__init__`.** This is just *listing* what building blocks the model owns (a `Linear`, a `Dropout`, etc.) — no computation happens yet. Think of it like laying out ingredients before you start cooking.
4. **Define the actual computation in `forward()`.** This is the "recipe" — it describes how data flows through the layers you declared. It's called automatically whenever you do `model(x)`.

```python
import torch
import torch.nn as nn

class MyModel(nn.Module):
    def __init__(self):
        super().__init__()                 # step 2 — always first
        self.fc1 = nn.Linear(10, 32)        # step 3 — declare a layer
        self.fc2 = nn.Linear(32, 2)
        self.dropout = nn.Dropout(0.2)

    def forward(self, x):                  # step 4 — describe the data flow
        x = torch.relu(self.fc1(x))
        x = self.dropout(x)
        x = self.fc2(x)
        return x  # raw logits — no activation on the final layer for classification

model = MyModel()
print(model)
# MyModel(
#   (fc1): Linear(in_features=10, out_features=32, bias=True)
#   (fc2): Linear(in_features=32, out_features=2, bias=True)
#   (dropout): Dropout(p=0.2, inplace=False)
# )

print(sum(p.numel() for p in model.parameters()))   # total learnable parameter count

x = torch.randn(4, 10)   # a fake batch: 4 samples, 10 features each
out = model(x)           # calls forward() for you -> shape [4, 2]
```

A few things worth noticing in that example:

- `x` never touches `self.dropout` or `self.fc2` until `forward()` says so — the order in `__init__` doesn't matter, only the order you use them in `forward()`.
- `print(model)` works out of the box, with no code from you, purely because `nn.Module` tracked the layers you assigned.
- Nothing here mentions batch size — `nn.Linear(10, 32)` doesn't care if you pass in 1 sample or 400; it just requires the *last* dimension to be `10`.

`nn.Sequential` is a shortcut for the common case where layers just run one after another with no branching or reused layers — it skips writing `forward()` by hand:

```python
model = nn.Sequential(
    nn.Linear(10, 32),
    nn.ReLU(),
    nn.Dropout(0.2),
    nn.Linear(32, 2),
)
```

---

# Activation Functions

Activation functions are inserted *between* layers to let the network learn non-linear patterns — stacking `Linear` layers alone, with nothing in between, collapses mathematically into a single `Linear` layer no matter how many you stack.

- **`nn.ReLU()`** — `max(0, x)`. The default choice for hidden layers: cheap to compute, works well in practice.
- **`nn.Sigmoid()`** — squashes any value into `(0, 1)`, like a probability. Used for binary classification, but in training it's paired with `BCEWithLogitsLoss` rather than applied by hand (see below).
- **`nn.Softmax(dim=-1)`** — turns a vector of scores into a probability distribution that sums to 1. Used for multi-class output, but again, during training `CrossEntropyLoss` applies it internally rather than you calling it yourself.
- **`nn.GELU()`** — a smoother version of ReLU; the standard choice inside transformers (BERT, GPT).
- **`nn.Tanh()`** — squashes to `(-1, 1)`; mostly seen in older RNN-style models.

**Rule of thumb:** put an activation *between* every pair of `Linear`/`Conv` layers, and leave the model's **final** output layer raw (no activation) — the loss function applies the matching activation internally, more efficiently and more numerically stably than you can by hand.

```python
import torch.nn as nn

layer = nn.Sequential(
    nn.Linear(10, 32),
    nn.ReLU(),          # activation goes here, between layers
    nn.Linear(32, 2),   # final layer stays raw — no activation
)
```

---

# Loss Functions

The loss function measures how wrong the model's predictions are; `loss.backward()` (covered in the training loop below) then uses that single number to figure out how to adjust every weight.

- **`nn.MSELoss()`** — for regression (predicting a continuous number). Penalizes larger errors more heavily than small ones.
- **`nn.CrossEntropyLoss()`** — for multi-class classification. Expects raw, unactivated logits `[B, num_classes]` and integer class labels `[B]` (dtype `long`) — it applies softmax internally, so never apply softmax yourself first.
- **`nn.BCEWithLogitsLoss()`** — for binary or multi-label classification. Also expects raw logits, and applies sigmoid internally — again, don't apply sigmoid yourself first.
- **`nn.L1Loss()`** — like MSE but for regression that's more robust to outliers (mean absolute error instead of squared error).

```python
criterion = nn.CrossEntropyLoss()
loss = criterion(logits, targets)   # logits: [B, num_classes] raw, targets: [B] int64
```

---

# Optimizers

The optimizer is what actually updates the model's weights, using the gradients that `loss.backward()` computed.

- **`torch.optim.SGD(params, lr=0.01, momentum=0.9)`** — the classic, simplest option. Needs more careful learning-rate tuning than the options below.
- **`torch.optim.Adam(params, lr=0.001)`** — adapts the learning rate per parameter automatically; a solid default that converges quickly with little tuning.
- **`torch.optim.AdamW(params, lr=0.001, weight_decay=0.01)`** — Adam with a corrected (decoupled) form of weight decay/regularization. This is the default choice for most modern models, including transformers — prefer it over plain Adam.

```python
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)
```

Note that you always pass `model.parameters()` (or a filtered subset of it) — this is how the optimizer knows exactly which tensors it's allowed to modify.

---

# Learning Rate & Scheduler

Learning rate controls the size of each weight update. Too high → loss oscillates or diverges (`nan`). Too low → training crawls. Common starting points: `1e-3` for Adam/AdamW, `1e-2` to `1e-1` for SGD. If loss doesn't decrease at all, try lowering it 10x; if it decreases too slowly, try raising it.

A **scheduler** adjusts the learning rate *during* training — usually decreasing it over time so training stabilizes and fine-tunes near the end.

```python
scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.1)
# multiplies LR by 0.1 every 10 epochs

# other common choices:
# torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=num_epochs)
# torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=3)

for epoch in range(num_epochs):
    train_one_epoch(...)
    scheduler.step()   # call once per epoch, after that epoch's optimizer.step() calls
```

`ReduceLROnPlateau` is special — it needs the validation loss passed in: `scheduler.step(val_loss)`.

---

# `model.train()` vs `model.eval()`

- `model.train()` — enables training-mode behavior: `Dropout` randomly zeroes activations, `BatchNorm` uses current-batch statistics.
- `model.eval()` — disables it: `Dropout` becomes a no-op, `BatchNorm` uses stored running statistics from training.

**Always** call `model.eval()` before validation/inference, and switch back to `model.train()` before resuming training. Forgetting this is one of the most common bugs, and it silently produces worse eval numbers rather than an error.

---

# `torch.no_grad()`

Disables gradient tracking within its block — use it whenever you won't call `.backward()` (validation, inference). This saves memory (no computation graph stored) and speeds things up.

```python
with torch.no_grad():
    outputs = model(x)
```

Related: `torch.inference_mode()` is a stricter, slightly faster version for pure inference.

---

# Device, for Training

Move **both** the model and every input/target tensor to the same device — mismatched devices raise a runtime error.

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

for x, y in loader:
    x, y = x.to(device), y.to(device)
    ...
```

---

# The Training Loop

This is where everything above comes together. If you're new to this, the important thing to understand first is: **one pass through this 5-step cycle updates the model's weights using a single batch of data.** You repeat the cycle for every batch, then repeat *that* for several epochs (full passes over the dataset), and the model gradually gets better.

1. **Forward pass** — feed a batch of inputs through the model to get its current predictions: `outputs = model(x)`. At this point the model hasn't learned anything new yet; this just asks "what does the model currently think?"
2. **Compute loss** — compare those predictions to the real answers with the loss function: `loss = criterion(outputs, y)`. This collapses "how wrong was the model" into a single number.
3. **`optimizer.zero_grad()`** — clear out gradients left over from the *previous* batch. This has to happen every single batch, and specifically *before* step 4. PyTorch accumulates (adds up) gradients by default rather than replacing them, which is a deliberate design choice for advanced use cases — but for a normal loop, forgetting this line means each batch's gradient update gets mixed with old, stale gradients from prior batches, which quietly corrupts training.
4. **`loss.backward()`** — this is where autograd (covered earlier) does its work: it walks backward through every operation that produced `loss` and computes exactly how much each individual weight in the model contributed to the error, storing that in each parameter's `.grad`.
5. **`optimizer.step()`** — the optimizer reads each parameter's `.grad` (computed in step 4) and nudges that parameter slightly in the direction that reduces the loss, scaled by the learning rate.

Only after step 5 has the model actually changed. Steps 1–2 measure; steps 3–5 learn.

```python
model.to(device)
best_val_loss = float("inf")

for epoch in range(num_epochs):
    # ---- Training ----
    model.train()                 # dropout/batchnorm behave in "training mode"
    train_loss = 0.0
    for x, y in train_loader:     # one batch at a time
        x, y = x.to(device), y.to(device)

        optimizer.zero_grad()     # 3. clear old gradients
        outputs = model(x)        # 1. forward pass
        loss = criterion(outputs, y)  # 2. how wrong were we?
        loss.backward()           # 4. compute new gradients

        # optional: gradient clipping, prevents exploding gradients (common in RNNs/transformers)
        torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

        optimizer.step()          # 5. update the weights
        train_loss += loss.item() * x.size(0)

    train_loss /= len(train_loader.dataset)

    # ---- Validation ----
    model.eval()                  # dropout/batchnorm switch to "eval mode"
    val_loss = 0.0
    correct = 0
    with torch.no_grad():         # no need to track gradients — we're only measuring, not learning
        for x, y in val_loader:
            x, y = x.to(device), y.to(device)
            outputs = model(x)
            loss = criterion(outputs, y)
            val_loss += loss.item() * x.size(0)
            preds = outputs.argmax(dim=1)
            correct += (preds == y).sum().item()

    val_loss /= len(val_loader.dataset)
    val_acc = correct / len(val_loader.dataset)

    print(f"Epoch {epoch+1}/{num_epochs} | "
          f"train_loss={train_loss:.4f} | val_loss={val_loss:.4f} | val_acc={val_acc:.4f}")

    # ---- Save best checkpoint ----
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        torch.save(model.state_dict(), "best_model.pth")
```

Notice the training and validation blocks look almost identical, except validation: uses `model.eval()` instead of `model.train()`, wraps everything in `torch.no_grad()`, and never calls `zero_grad()`, `backward()`, or `step()`. That's the whole difference between "learning from a batch" and "just checking how the model does on a batch."

**Why `loss.item() * x.size(0)`?** `loss` is already the *mean* loss over the batch, not the sum. Multiplying by the batch size undoes that averaging, so that summing across batches and dividing by the total dataset size at the very end gives the correct overall average — this matters because the last batch of an epoch is often smaller than the rest, so a plain average-of-averages would be slightly wrong.

### Validation loop, standalone

Same shape as above but wrapped in `torch.no_grad()`, with `model.eval()`, and **no** `zero_grad()` / `backward()` / `step()` — you're only measuring performance, not learning.

### Early stopping

Stop training when validation loss stops improving, to avoid overfitting:

```python
patience, patience_counter = 5, 0
best_val_loss = float("inf")

for epoch in range(num_epochs):
    ...  # train + validate as above
    if val_loss < best_val_loss:
        best_val_loss = val_loss
        patience_counter = 0
        torch.save(model.state_dict(), "best_model.pth")
    else:
        patience_counter += 1
        if patience_counter >= patience:
            print("Early stopping.")
            break
```

---

# Saving / Loading Models

There are two different things you can save, and they solve different problems — mixing them up is a common source of confusion.

**Option 1 — save just the weights (`state_dict`).** This is the recommended default. A `state_dict` is a plain Python dictionary mapping each layer's name to its current tensor of weights — nothing else, no architecture code, no optimizer state. Because it's "just numbers," it's portable and safe against version drift, but it means you must already have the exact same model class available to load it back into.

```python
# Save
torch.save(model.state_dict(), "model.pth")

# Load — note this is a TWO-step process, not one:
model = MyModel()                                          # 1. rebuild the same architecture
model.load_state_dict(torch.load("model.pth", map_location=device))  # 2. pour the saved weights into it
model.to(device)
model.eval()            # always set eval mode before inference — see model.train()/eval() above
```

`map_location=device` matters if you trained on a GPU but are now loading on a machine without one (or vice versa) — without it, PyTorch tries to load the tensors onto whatever device they were saved from, and errors out if that device doesn't exist on this machine.

**Option 2 — save a full checkpoint.** Use this when you want to *pause and resume training later*, not just do inference. A `state_dict` alone forgets the optimizer's internal state (like Adam's per-parameter running averages) and what epoch you were on — resuming from just weights means the optimizer effectively restarts from scratch, which can temporarily hurt training. A checkpoint bundles everything you need to pick back up exactly where you left off:

```python
torch.save({
    "epoch": epoch,
    "model_state_dict": model.state_dict(),
    "optimizer_state_dict": optimizer.state_dict(),
    "val_loss": val_loss,
}, "checkpoint.pth")

# Resume
checkpoint = torch.load("checkpoint.pth", map_location=device)
model.load_state_dict(checkpoint["model_state_dict"])
optimizer.load_state_dict(checkpoint["optimizer_state_dict"])
start_epoch = checkpoint["epoch"] + 1   # continue from the next epoch, not the same one again
```

**Rule of thumb:** saving your final/best model for later use or sharing → `state_dict`. Saving mid-training so you (or a crashed job) can resume later → full checkpoint.