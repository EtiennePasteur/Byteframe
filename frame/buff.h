#define BufferSize 2050
int     BufferIndex;
char    BufferArray[BufferSize];

int getByte(int index)
{
  if ((BufferArray[index    ] < 'a') || (BufferArray[index    ] > 'p')) return -1;
  if ((BufferArray[index + 1] < 'a') || (BufferArray[index + 1] > 'p')) return -1;
  return ((int)BufferArray[index] - 'a') + (((int)BufferArray[index + 1] - 'a') << 4);
}

int getWord(int index)
{
  int a = getByte(index); 
  if (a == -1) return -1;
  int b = getByte(index + 2);
  if (b == -1) return -1;
  return a + (b << 8);
}

int getSignature(int index, char*str)
{
  while (*str != 0) {
      if (BufferArray[index++] != *str) return false;
      str++;
  }
  return true;
}
