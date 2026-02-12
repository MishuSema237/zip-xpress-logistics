
path = r'c:\Users\HP\Desktop\MISHAEL_SEMA_EKOM\Websites\GLOBALTRACK\global-track-courier\src\pages\Home.tsx'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix redundant </AnimatedCard> around line 332
# Line 332 in previous view was: 332:         </AnimatedCard>
# It's better to search for it.
clean_lines = []
skip_next_animated_card = False
found_redundant = False
for i, line in enumerate(lines):
    # The redundant one is right after the centered div block for the branches title
    if 'Strategic locations across key international logistics hubs to serve you better.' in line:
        found_redundant = True
    
    if found_redundant and '</AnimatedCard>' in line and not skip_next_animated_card:
        # This is the first </AnimatedCard> (correct)
        clean_lines.append(line)
        skip_next_animated_card = True
        continue
    
    if skip_next_animated_card and '</AnimatedCard>' in line:
        # This is the second </AnimatedCard> (redundant)
        skip_next_animated_card = False
        continue

    # Truncate at the first "export default Home;"
    if 'export default Home;' in line:
        # Keep everything before the ; if it's mashed, or just the export line if clean
        if '<div' in line or '{' in line:
             # it's messy, split it
             parts = line.split('export default Home;')
             # Actually, just end the file here
             clean_lines.append("export default Home;\n")
             break
        else:
             clean_lines.append(line)
             break
             
    clean_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(clean_lines)

print("Home.tsx surgically fixed and restored.")
